import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { AsyncWrapper } from "../Error/AsyncWrapper";

export const addToCart = AsyncWrapper(async (req: Request, res: Response) => {
  const {
    productId,
    quantity,
    cartId,
  }: {
    cartId: string;
    productId: string;
    quantity: {
      ddnStock: number;
      dlStock: number;
      ibStock: number;
      godwanStock: number;
      mainStock: number;
      mtStock: number;
      smapleLine: number;
    };
  } = req.body;
  console.log(cartId);
  if (
    !quantity?.ddnStock &&
    !quantity?.dlStock &&
    !quantity?.ibStock &&
    !quantity?.godwanStock &&
    !quantity?.mainStock &&
    !quantity?.mtStock &&
    !quantity?.smapleLine
  ) {
    return res.status(400).json({
      success: false,
      message: "invalid cart qty",
    });
  }
  const isExist = await prisma.cart.findUnique({
    where: {
      cartId,
      productId,
    },
  });
  if (isExist) {
    const cart = await prisma.cart.update({
      where: {
        cartId,
        productId,
      },
      data: {
        quantity: {
          update: {
            ddnStock: quantity.ddnStock,
            dlStock: quantity.dlStock,
            ibStock: quantity.ibStock,
            godwanStock: quantity.godwanStock,
            mainStock: quantity.mainStock,
            mtStock: quantity.mtStock,
            smapleLine: quantity.smapleLine,
          },
        },
      },
    });

    res.status(201).json({ success: true, cart });
  } else {
    const cart = await prisma.cart.create({
      data: {
        cartId: cartId,
        productId: productId,
        quantity: {
          create: {
            ddnStock: quantity.ddnStock,
            dlStock: quantity.dlStock,
            ibStock: quantity.ibStock,
            godwanStock: quantity.godwanStock,
            mainStock: quantity.mainStock,
            mtStock: quantity.mtStock,
            smapleLine: quantity.smapleLine,
          },
        },
      },
    });
    res.status(201).json({ success: true, cart });
  }

  res.status(500).json({
    success: true,
    location: "cart",
    message: "Internal Error Accours",
  });
});

export const getCart = AsyncWrapper(async (req: Request, res: Response) => {
  const cartId = req.body.cartId;
  const cart = await prisma.cart.findMany({
    where: {
      cartId,
    },
    select: {
      productId: true,
      quantity: {
        select: {
          ddnStock: true,
          dlStock: true,
          ibStock: true,
          godwanStock: true,
          mainStock: true,
          mtStock: true,
          smapleLine: true,
        },
      },
    },
  });
  res.status(200).json({ success: true, cart });
});
