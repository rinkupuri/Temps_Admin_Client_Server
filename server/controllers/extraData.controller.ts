import { Request, Response } from "express";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import prisma from "../prisma/prismaClient";

const createExtraData = AsyncWrapper(async (req: Request, res: Response) => {
  const { name, value } = req.body;
  const isExist = await prisma.extraData.findUnique({
    where: {
      name,
    },
  });

  if (isExist) {
    return res.status(400).json({
      success: false,
      message: "Data Already Exist",
    });
  }

  const data = await prisma.extraData.create({
    data: {
      name,
      value,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Data Create Succesfull",
  });
});


const getDataByName = AsyncWrapper(async (req: Request, res: Response) => {
    const name =  req.params.name;
    
})
