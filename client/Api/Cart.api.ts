import { cartAPiType } from "@/types/CartContextTypes";
import axios from "axios";

export const addToCartAPI = async ({
  fromLocation,
  model,
  quantity,
}: cartAPiType) => {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/cart/addItem`,
      JSON.stringify({
        model,
        fromLocation,
        quantity,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    .then((res) => {})
    .catch((err) => {
      const intervalCartAPI = setInterval(() => {
        addToCartAPI({
          fromLocation,
          model,
          quantity,
        });
      }, 3000);
      clearInterval(intervalCartAPI);
    });
};

export const getCartAPI = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/cart/getCart`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
