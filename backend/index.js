const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const port = process.env.PORT || 5000;

dotenv.config();
require('./app/config/database')();
require('./app/commun/initScript');
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
 res.send('Hello World!');
});
const authRoutes = require('./app/routes/auth.routes');
const userRoutes = require('./app/routes/user.routes');
const skillRoutes = require('./app/routes/skill.routes');
const jobRoutes = require('./app/routes/job.routes');
const mobilityRoutes = require('./app/routes/mobility.routes');
const trainingRoutes = require('./app/routes/training.routes');
const notificationRoutes = require('./app/routes/notification.routes');
const dashboardRoutes = require('./app/routes/dashboard.routes');


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mobility', mobilityRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
const { errorHandler, notFound } = require('./app/middlewares/error.middleware');
app.use(notFound);
app.use(errorHandler);
// Start the server
app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});