import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import prisma from "../prisma/prismaClient";

export const register = AsyncWrapper(async (req: Request, res: Response) => {
  let { firstName, lastName, email, password } = req.body;
  if (!firstName && !lastName && !email && !password)
    res.status(403).json({ success: false, message: "invalid data" });
  password = await bcrypt.hash(password, 10);

  const isExsit = await prisma.user.findUnique({ where: { email } });
  if (isExsit) res.status(403).json({ success: false, message: "user exist" });
  const user = await prisma.user.create({
    data: { name: firstName + " " + lastName, email, password },
  });

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = AsyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //   validating fields
  if (!email && !password)
    res.status(403).json({ success: false, message: "invalid data" });
  // getting User
  const user = await prisma.user.findUnique({ where: { email } });
  //   throw error if user not exist
  if (!user)
    res.status(403).json({ success: false, message: "user not exist" });
  // checking password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    res.status(403).json({ success: false, message: "invalid credentials" });
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});
