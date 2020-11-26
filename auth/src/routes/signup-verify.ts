import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/users/signup-verify',
  [
    body('phone')
    .trim()
    .isLength({ min: 10, max: 13 })
    .isNumeric().withMessage('Phone number must be between 4 and 20 characters'),
    body('otp')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('OTP must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    const existingUser = await User.findOne({ phone });
    if (!existingUser) {
      throw new BadRequestError('User does not exists.');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      otp
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    // existingUser.set({
    //   valid: true
    // });
    // await existingUser.save();
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        phone: existingUser.phone
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.cookies = {
      jwt: userJwt
    };
    // res.cookie('jwt', userJwt)
    res.cookie('jwt', userJwt).status(200).json({success: true, existingUser: existingUser.valid});

  }
);

export { router as signupVerifyRouter };
