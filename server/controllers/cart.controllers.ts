import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { AsyncWrapper } from "../Error/AsyncWrapper";

export const addToCart = AsyncWrapper(async (req: Request, res: Response) => {
  const {
    model,
    quantity,
    fromLocation,
    cartId,
  }: {
    cartId: string;
    model: string;
    fromLocation: string;
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
    !fromLocation &&
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
  const isExist = await prisma.cart.findMany({
    where: {
      AND: [
        {
          cartId: {
            equals: cartId,
          },
        },
        {
          model: {
            equals: model,
          },
        },
      ],
    },
  });
  console.log(isExist);
  if (isExist.length) {
    const cart = await prisma.cart.update({
      where: {
        id: isExist[0].id,
      },
      data: {
        fromLocation,
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
        cartId,
        model,
        fromLocation,
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
});

export const getCart = AsyncWrapper(async (req: Request, res: Response) => {
  const cartId = req.body.cartId;
  const cart = await prisma.cart.findMany({
    where: {
      cartId,
    },
    select: {
      model: true,
      fromLocation: true,
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

  for (let i = 0; i < cart.length; i++) {
    const product = await prisma.product.findUnique({
      where: {
        modelName: cart[i].model,
      },
      select: {
        modelName: true,
        mrp: true,
        image: true,
        brand: true,
        stockId: {
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
    // @ts-ignore
    cart[i].product = product;
  }
  res.status(200).json({ success: true, cart });
});
