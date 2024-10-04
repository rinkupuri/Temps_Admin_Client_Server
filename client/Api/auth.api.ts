import { apiErrorHandler } from "@/Error/APIError.handler";
import { setUser } from "@/Redux/State/api.slice";
import axios from "axios";
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getUser = async () => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      throw new Error("Server URL is not defined in environment variables.");
    }

    // Make POST request with email and password in the request body
    const response = await axios.get(`${serverUrl}/auth/get`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Extract status code
    const data = response.data;
    console.log(response.data);
    await setUser(response.data?.user);
    // Return the response status code, 1 for success, 0 for failure
    return data.user ? data.user : null;

    // catching the error cases, if it's an axios error you can access the response code here
  } catch (error) {
    // Handle error cases, if it's an axios error you can access the response code here
    apiErrorHandler({ error });
  }
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    // Ensure environment variable is set

    if (!serverUrl) {
      throw new Error("Server URL is not defined in environment variables.");
    }

    // Make POST request with email and password in the request body
    const response = await axios.post(
      `${serverUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // Extract status code
    const data = response.data;
    console.log(data);
    setUser(data?.user);
    console.log(data);
  } catch (error) {
    apiErrorHandler({ error });
  }
};
