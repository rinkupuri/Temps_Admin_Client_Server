import axios, { AxiosError } from "axios";
import { FC } from "react";

interface ErrorProps {
  error: any;
  errorMessage?: string;
}

export const apiErrorHandler: FC<ErrorProps> = ({ error, errorMessage }) => {
  // Handle Axios errors and other errors
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    console.log(error);
    const message = error.response.data.message;
    switch (status) {
      case 400:
        throw new Error("Invalid request: Check your input fields.");
      case 401:
        throw new Error("Unauthorized: Incorrect email or password.");
      case 403:
        throw new Error(`${status}: Forbidden. ${message}`);
      case 404:
        throw new Error(`${status}: Not Found. ${message}`);
      case 500:
        throw new Error("Server error: Please try again later.");
      default:
        throw new Error("An unknown error occurred.");
    }
  } else {
    // For any other errors (non-Axios errors)
    throw new Error(errorMessage || "An unexpected error occurred.");
  }
};
