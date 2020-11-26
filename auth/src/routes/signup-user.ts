import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/register',
[
  body('email').isEmail().withMessage('Email must be valid'),
  body('name').isLength({ min: 3, max: 200 }).withMessage('Name must be between 3 and 200 characters')
],validateRequest, currentUser, async (req: Request, res: Response) => {
  if(req.currentUser && req.currentUser.phone  ){
    const { phone } = req.currentUser;
    const { name, email } = req.body;

    const existingUser = await User.findOne({ phone });
    if (!existingUser || existingUser.valid === true ) {
      throw new BadRequestError('User not found or already registerd');
    }
    else {
      existingUser.set({
      valid: true
    });
    await existingUser.save();
    }
  }
  res.send({ currentUser: req.currentUser || null });
});

export { router as signupUserRouter };
