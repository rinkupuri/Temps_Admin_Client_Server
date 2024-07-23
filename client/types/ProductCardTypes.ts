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
  id?: string;
  image: string;
  brand: string;
  modelName: string;
  mrp: number;
  stockId: Stock;
}

export interface cart {
  product: Product;
  fromLocation: string;
  quantity: Stock;
}
