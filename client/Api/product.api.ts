import axios from "axios";

export const searchProductAPI = async ({
  queryModel,
}: {
  queryModel: string;
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/product/search?query=${queryModel}`
    );
    return res.data.products;
  } catch (err) {
    return console.log(err);
  }
};

export const getProductsAPI = async ({
  brandQuerry,
  limit,
  page,
}: {
  brandQuerry: string;
  page: number;
  limit: number;
}) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/product/get?brand=${brandQuerry}&page=${page}&limit=${limit}`
  );
   
  return res.data;
};
