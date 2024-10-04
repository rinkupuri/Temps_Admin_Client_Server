"use client";
import { useGetMenusQuery } from "@/Redux/RTK/api";
import { useGetUserQuery, useLoginUserMutation } from "@/Redux/RTK/auth.api";
import { useAddToCartMutation, useGetCartQuery } from "@/Redux/RTK/cart.api";
import { useGetProductsQuery } from "@/Redux/RTK/product.api";
import React, { useEffect } from "react";

const TestAllAPIs = () => {
  // Queries
  const { data: user, error: userError } = useGetUserQuery({});
  const { data: products, error: productsError } = useGetProductsQuery({
    brandQuerry: "Nike",
    page: 1,
    limit: 10,
  });
  const { data: menus, error: menusError } = useGetMenusQuery({});
  const { data: cart, error: cartError } = useGetCartQuery({});

  // Mutations
  const [loginUser] = useLoginUserMutation();
  const [addToCart] = useAddToCartMutation();

  useEffect(() => {
    // Calling login API
    const testLogin = async () => {
      try {
        const loginResponse = await loginUser({
          email: "rinkupuri124@gmail.com",
          password: "main1234",
        }).unwrap();
        console.log("Login Successful:", loginResponse);
      } catch (error) {
        console.error("Login Error:", error);
      }
    };

    // Calling addToCart API
    const testAddToCart = async () => {
      try {
        const addToCartResponse = await addToCart({
          model: "XYZ123",
          quantity: 1,
        }).unwrap();
        console.log("Added to Cart:", addToCartResponse);
      } catch (error) {
        console.error("Add to Cart Error:", error);
      }
    };

    // Call APIs inside useEffect
    testLogin();
    testAddToCart();
  }, [loginUser, addToCart]);

  // Check if data is loading or if there's an error
  if (!user || !products || !menus || !cart) {
    return <div>Loading...</div>;
  }

  if (userError || productsError || menusError || cartError) {
    return <div>Error occurred!</div>;
  }

  return (
    <div>
      <h1>API Test Results</h1>
      <h2>User Data</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h2>Products</h2>
      <pre>{JSON.stringify(products, null, 2)}</pre>

      <h2>Menus</h2>
      <pre>{JSON.stringify(menus, null, 2)}</pre>

      <h2>Cart</h2>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};

export default TestAllAPIs;
