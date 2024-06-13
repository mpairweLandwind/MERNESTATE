import prisma from "../lib/prisma.mjs";
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.mjs';
import jwt from 'jsonwebtoken';

// User Signup
export const signup = async (req, res, next) => {
  const { username, email, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, role, password: hashedPassword }
    });
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

// User Signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await prisma.user.findUnique({ where: { email } });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { password: pass, ...rest } = validUser;

    // Send the token and user data in the response body
    res.status(200).json({
      success: true,
      token,
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

// Google Authentication
export const google = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: pass, ...rest } = user;
      res.status(200).json({
        success: true,
        token,
        user: rest,
      });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = await prisma.user.create({
        data: {
          username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          role: req.body.role,
          password: hashedPassword,
          avatar: req.body.photo,
        }
      });
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: pass, ...rest } = newUser;
      res.status(200).json({
        success: true,
        token,
        user: rest,
      });
    }
  } catch (error) {
    next(error);
  }
};

// User SignOut
export const signOut = async (req, res, next) => {
  try {
    // Since we are using tokens and not cookies, we don't need to clear cookies.
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
