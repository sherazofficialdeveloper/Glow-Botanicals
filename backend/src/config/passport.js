// backend/src/config/passport.js

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (_req, _rawJwtToken, done) => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          return done(new Error('JWT_SECRET is required'));
        }
        done(null, secret);
      },
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id).select('-password');
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
