const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken');

passport.use(
    new BearerStrategy((token, done) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = {
          id: decoded.id,
          role: decoded.role, 
        };
        return done(null, user);
      } catch (err) {
        return done(null, false);
      }
    })
  );