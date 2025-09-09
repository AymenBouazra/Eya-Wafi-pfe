const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/resetToken');
const randomString = require('randomstring');
const { createTransport } = require('nodemailer');

exports.currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà existant' });
        }
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.updateUserAndLogin = async (req, res) => {
    try {
        const { password } = req.body;
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }
        const hash = bcryptjs.hashSync(password, 10);
        await User.findByIdAndUpdate(id, { $set: { password: hash, isActive: true } }, { new: true });
        const token = jwt.sign({ userId: user._id, userRole: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: process.env.JWT_EXPIRES });
        res.status(200).json({ token, role: user.role, message: 'Authentification réussie' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }
        const isMatch = bcryptjs.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }
        const token = jwt.sign({ userId: user._id, userRole: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: process.env.JWT_EXPIRES || '7d' });
        res.status(200).json({ token, role: user.role, message: 'Authentification réussie' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const resetToken = randomString.generate(30)
            await Token.create({
                resetToken: resetToken,
                userId: user._id
            });
            const transporter = createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            await transporter.sendMail({
                from: `<Eya Wafi> ${process.env.EMAIL}`,
                to: email,
                subject: "Mot de passe oublié",
                html: ` 
         <h2>Réinitialiser le mot de passe</h2><br>
         <a href='${process.env.HOST || 'http://localhost:4200/'}reset-password/${resetToken}'>Lien de réinitialisation du mot de passe</a>
         <b style='color:red'>Ce lien expirera après 15 minutes </b>
         `,
            });
            res.json({ message: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe!' })
        } else {
            res.status(400).json({ message: 'Impossible de trouver un utilisateur avec cette adresse e-mail, essayez à nouveau avec un compte e-mail existant!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error!' })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const tokenFound = await Token.findOne({ resetToken: req.params.token });
        if (tokenFound) {
            const user = await User.findById(tokenFound.userId);
            if (user) {
                const hash = await bcryptjs.hash(password, 10);
                await User.findByIdAndUpdate(tokenFound.userId, { password: hash }, { new: true });
                const transporter = createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: `${process.env.EMAIL}`,
                    to: user.email,
                    subject: "Mot de passe mis à jour ✔",
                    html: ` 
         <b>Votre mot de passe a été mis à jour avec succès</b><br>
       `,
                });
                res.send({ message: 'Mot de passe réinitialisé!' })
            } else {
                res.status(400).json({ message: 'Lien de réinitialisation du mot de passe expiré ou invalide, créez un nouveau lien de réinitialisation!' });
            }
        } else {
            res.status(400).json({ message: 'Lien de réinitialisation du mot de passe expiré ou invalide, créez un nouveau lien de réinitialisation!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error!' })
    }
}