import Page from "@/components/ProductViewPage";
import React, { Suspense } from "react";

const OrderComponent = () => {
  return (
    <Suspense>
      <Page title="Order" />
    </Suspense>
  );
};

export default OrderComponent;
