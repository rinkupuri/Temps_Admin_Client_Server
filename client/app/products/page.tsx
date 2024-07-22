import Page from "@/components/ProductViewPage";
import { Suspense } from "react";

const ProductComponent = () => {
  return (
    <Suspense>
      <Page title="Products" />
    </Suspense>
  );
};

export default ProductComponent;
