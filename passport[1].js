// server/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User.model");

// ── Google Strategy ──────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error("No email from Google"), null);

        let user = await User.findOne({ email });

        if (user) {
          // Link Google if the user previously signed up with email
          if (user.provider === "local") {
            user.provider = "google";
            user.providerId = profile.id;
            user.avatar = profile.photos?.[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        // New user via Google
        user = await User.create({
          name: profile.displayName,
          email,
          provider: "google",
          providerId: profile.id,
          avatar: profile.photos?.[0]?.value,
          isVerified: true,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ── Facebook Strategy ────────────────────────────────────────
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error("No email from Facebook"), null);

        let user = await User.findOne({ email });

        if (user) {
          if (user.provider === "local") {
            user.provider = "facebook";
            user.providerId = profile.id;
            user.avatar = profile.photos?.[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName,
          email,
          provider: "facebook",
          providerId: profile.id,
          avatar: profile.photos?.[0]?.value,
          isVerified: true,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
