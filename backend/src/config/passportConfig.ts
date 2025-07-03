import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await prisma.users.findFirst({
          where: { username },
        });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.users.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
