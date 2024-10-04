import { apiErrorHandler } from "@/Error/APIError.handler";
import { Menu } from "@/types/types";
import axios from "axios";

export const getMenus = async (): Promise<Menu[] | undefined> => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
      throw new Error("Server URL is not defined in environment variables.");
    }

    // Make POST request with email and password in the request body
    const response = await axios.get(`${serverUrl}/webData/Menu/get`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data.menus as Menu[];
  } catch (error) {
    apiErrorHandler({ error, errorMessage: "Internal Server Error" });
  }
};
