import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { AsyncWrapper } from "../Error/AsyncWrapper";

// Controller to handle adding items to the cart
export const addToCart = AsyncWrapper(async (req: Request, res: Response) => {
  // Destructure necessary fields from the request body
  const {
    model,
    quantity,
    cartId,
  }: {
    cartId: string;
    model: string;
    quantity: number;
  } = req.body;

  console.log(cartId); // Log the cartId for debugging

  // Validate if the quantity is valid (should be greater than 0)
  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart quantity",
    });
  }

  // Check if the item already exists in the cart
  const existingCartItem = await prisma.cart.findFirst({
    where: {
      cartId,
      model,
    },
  });

  console.log(existingCartItem); // Log the existing cart item for debugging

  // If the item already exists, update the quantity
  if (existingCartItem) {
    const updatedCartItem = await prisma.cart.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity,
      },
    });
    return res.status(200).json({ success: true, cart: updatedCartItem });
  } else {
    // If the item does not exist, create a new entry in the cart
    const newCartItem = await prisma.cart.create({
      data: {
        cartId,
        model,
        quantity,
      },
    });
    return res.status(201).json({ success: true, cart: newCartItem });
  }
});

// Controller to fetch the cart details by cartId
export const getCart = AsyncWrapper(async (req: Request, res: Response) => {
  const cartId = req.body.cartId;

  // Fetch all cart items for the given cartId
  const cart = await prisma.cart.findMany({
    where: {
      cartId,
    },
    select: {
      model: true,
      quantity: true,
    },
  });

  // Iterate through the cart items and fetch related product details for each item
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
    // Dynamically add product information to the cart item
    // @ts-ignore - TypeScript may not recognize this assignment
    cart[i].product = product;
  }

  // Return the cart items with their associated product details
  res.status(200).json({ success: true, cart });
});
