import type { Request, Response } from 'express';

import HttpError from '@/errors/HttpError.ts';
import User from '@/models/User.ts';
import type { UserInput } from '@/types/User.d.ts';
import { signJwt } from '@/utils/jwt.ts';
import { verifyPassword } from '@/utils/password.ts';

type SigninInput = Pick<Required<UserInput>, 'email' | 'password'>;

async function signin(req: Request, res: Response) {
  const { email, password } = req.body as SigninInput;

  try {
    const user = await User.readByEmailWithPassword(email);

    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const { password: _password, ...signedUser } = user;
    const token = signJwt({
      userId: signedUser.id,
      name: signedUser.name,
      email: signedUser.email,
    });

    return res.json({ auth: true, token });
  } catch (error) {
    throw new HttpError('Invalid credentials', 401);
  }
}

export default { signin };
