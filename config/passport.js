const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            // If user exists with this email but not googleId, you might want to link them.
            // For simplicity, we'll create a new user or find by email if that's preferred.
            user = await User.findOne({ email: newUser.email });
            if (user) {
              // User exists, but not with Google. You could link accounts here.
              // For now, we'll just log them in.
              done(null, user);
            } else {
              // Create new user
              user = await User.create(newUser);
              done(null, user);
            }
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  // These are not strictly needed for JWT stateless auth, but passport requires them.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
