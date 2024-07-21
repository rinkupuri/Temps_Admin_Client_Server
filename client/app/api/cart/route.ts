import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Read and parse the JSON body
    const file = body; // Assuming the parsed body is your 'file' object
    console.log(file);
    if (!file) {
      return new Response("Data must be need to update", {
        status: 401,
      });
    }

    // Resolve the path to `jsons/cart.json`
    const jsonDir = path.resolve(process.cwd(), "temp/jsons");
    const filePath = path.join(jsonDir, "cart.json");

    // Ensure the directory exists

    await writeFile(filePath, JSON.stringify(file)); // Use fs/promises for async writeFile

    return new Response("Data Written", {
      status: 200,
    });
  } catch (err) {
    console.log({
      location: "cart",
      page: "productCard",
      message: err,
    });
    return Response.json(
      {
        component: "cart",
        page: "productCard",
        message: err,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  return Response.json({ message: "Hello world" });
}
