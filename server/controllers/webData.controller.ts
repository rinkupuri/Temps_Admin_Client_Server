import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { AsyncWrapper } from "../Error/AsyncWrapper";
import fs from "fs";
import path from "path";
import { upload } from "../utils/multer";
import { AuthenticatedRequest } from "../types/auth.types";
import { validateId } from "../utils/ValidateId";

// Create a new menu with file upload
export const createMenu = [
  upload.single("image"), // Middleware for uploading a single image file
  AsyncWrapper(async (req: Request, res: Response) => {
    const {
      name,
      link,
      desc,
      permission,
    }: { name: string; link: string; permission: string; desc: string } =
      req.body;

    if (!name || !link || !permission)
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // Check if an image file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Construct the URL for the uploaded image
    const imageUrl = `${process.env.HOST_URL}/api/v1/images/webdata/${req.file.filename}`;

    // Create the menu entry in the database
    const newMenu = await prisma.menu.create({
      data: {
        name,
        link,
        desc,
        image: imageUrl, // Save the generated image URL
        permission,
      },
    });

    res.status(201).json({
      success: true,
      menu: newMenu,
    });
  }),
];

// Update an existing menu entry
export const updateMenu = [
  upload.single("image"), // Middleware for uploading a new image file (optional)
  AsyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params; // Menu ID passed as a URL parameter
    const {
      name,
      link,
      permission,
    }: { name: string; link: string; permission: string } = req.body;

    // Find the menu item by ID
    const existingMenu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Check if a new image file is uploaded
    let imageUrl = existingMenu.image;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/webdata/${
        req.file.filename
      }`; // Update the image URL
    }

    // Update the menu entry in the database
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        name: name || existingMenu.name, // Update only if provided
        link: link || existingMenu.link,
        image: imageUrl, // Use the new or existing image URL
        permission: permission || existingMenu.permission,
      },
    });

    res.status(200).json({
      success: true,
      menu: updatedMenu,
    });
  }),
];

// Delete a menu entry by ID
export const deleteMenu = AsyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params; // Get the menu ID from the request parameters

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Menu ID is required",
    });
  }

  // Find the menu item to delete
  const menu = await prisma.menu.findUnique({
    where: { id },
  });

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu item not found",
    });
  }

  // Optionally: Remove the associated image file from the public/webdata/ directory
  if (menu.image) {
    const imagePath = path.join(
      __dirname,
      "../../public/webdata",
      path.basename(menu.image)
    ); // Get the image file path
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file
    }
  }

  // Delete the menu item from the database
  await prisma.menu.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: "Menu item deleted successfully",
  });
});

export const getUserMenus = AsyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: userId } = req.user; // Assuming userId is passed in the request body
    validateId(userId, res);

    // getMenu for admin and super user only

    console.log(req.user);
    if (req.user.role === "ADMIN" || req.user.role === "SUSER") {
      const menus = await prisma.menu.findMany({
        select: {
          id: true,
          image: true,
          link: true,
          name: true,
          desc: true,
          permission: true,
        },
      });
      return res.status(200).json({
        success: true,
        menus,
      });
    }

    // Fetch user and their location permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        Permission: true, // Fetch only the Location field from the user
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch all menus from the database
    const menus = await prisma.menu.findMany();

    // Filter menus based on user's location permissions
    const accessibleMenus = menus.filter((menu) => {
      // Only return menus where the user's location matches the menu's permission
      return user.Permission.includes(menu.permission || ""); // Check if permission is in user's Location
    });

    // Return the filtered menus
    res.status(200).json({
      success: true,
      menus: accessibleMenus,
    });
  }
);
