export interface Stock {
  ddnStock: number;
  dlStock: number;
  godwanStock: number;
  ibStock: number;
  mainStock: number;
  mtStock: number;
  smapleLine: number;
}

export interface Product {
  image: string;
  brand: string;
  modelName: string;
  mrp: number;
  stockId: Stock;
}

export interface cart {
  productId: string;
  quantity: Stock;
}
