const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const email =
                    profile.emails && profile.emails.length > 0
                        ? profile.emails[0].value
                        : '';

                // 1. Check if user exists by Google ID
                let user = await User.findByGoogleId(profile.id);
                if (user) {
                    return cb(null, user);
                }

                // 2. Check if user exists by email (signed up manually before)
                if (email) {
                    user = await User.findByEmail(email);
                    if (user) {
                        // Link Google account to existing user
                        user = await User.updateById(user.id, { googleId: profile.id });
                        return cb(null, user);
                    }
                }

                // 3. Create brand new user
                const newUser = await User.create({
                    googleId: profile.id,
                    displayName: profile.displayName || '',
                    firstName:
                        profile.name && profile.name.givenName
                            ? profile.name.givenName
                            : '',
                    lastName:
                        profile.name && profile.name.familyName
                            ? profile.name.familyName
                            : '',
                    email: email,
                    photoURL:
                        profile.photos && profile.photos.length > 0
                            ? profile.photos[0].value
                            : '',
                    authProvider: 'google',
                });

                return cb(null, newUser);
            } catch (err) {
                console.error('Error in Google Strategy:', err);
                return cb(err, null);
            }
        }
    )
);

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

module.exports = passport;
