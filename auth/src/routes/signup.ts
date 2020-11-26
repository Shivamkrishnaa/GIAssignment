import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();
const client = require('twilio')('AC7e8fc1763042449feb4507545614ced5', 'dc9fd3acfe1af4749677843db7ba14c2');

router.route(['/api/users/signup', '/api/users/signin']).post(
  [
    body('phone')
    .trim()
    .isLength({ min: 10, max: 13 })
    .isNumeric().withMessage('Phone number must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { phone } = req.body, token = Math.random().toString(36).substring(7);

    const existingUser = await User.findOne({ phone });
    if(existingUser ){
      console.log(existingUser, existingUser.valid, existingUser.valid==false);
      
    }
    
    if (!existingUser) {
      const user = User.build({ phone, password: token, valid: false });
      await user.save();
    }
    else {
      existingUser.set({
        password: token
      });
      await existingUser.save();
    }
    client.messages
    .create({ body: `You OTP is ${token}.`, from: '+12185495004', to: phone })
    .then(() => {
      return res.status(200).json({success: true,existingUser});
    })
    .catch(() => {
      return res.status(200).json({success: false,existingUser});
    })

  }
);

export { router as signupRouter };
