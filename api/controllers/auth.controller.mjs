import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt'; // Updated import
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Updated to use bcrypt
    const newUser = await prisma.user.create({
      data: { username, email, role, password: hashedPassword }
    });
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await prisma.user.findUnique({ where: { email } });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = await bcrypt.compare(password, validUser.password); // Updated to use bcrypt
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser;
    res.cookie('access_token', token, { httpOnly: true })
       .status(200)
       .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user;
      res.cookie('access_token', token, { httpOnly: true })
         .status(200)
         .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10); // Updated to use bcrypt
      const newUser = await prisma.user.create({
        data: {
          username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          role: req.body.role,
          password: hashedPassword,
          avatar: req.body.photo,
        }
      });
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser;
      res.cookie('access_token', token, { httpOnly: true })
         .status(200)
         .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
