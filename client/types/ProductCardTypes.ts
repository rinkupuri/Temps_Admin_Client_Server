export interface product {
  "Model No.": string;
  Brand: string;
  Image: string;
  MRP: string;
  Cart?: string;
  MTSTOCK: string;
  IBSTOCK: string;
  DLSTOCK: string;
  DDNSTOCK: string;
  Total: string;
}

export interface cart {
  product: product;
  MTQty: number;
  IBQty: number;
  DLQty: number;
  DDNQty: number;
  MoveFrom: string;
}
