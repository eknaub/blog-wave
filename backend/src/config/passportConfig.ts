import passport from 'passport';
import prisma from '../prisma/client';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

export default passport;
