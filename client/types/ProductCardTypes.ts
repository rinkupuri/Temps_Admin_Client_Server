export interface Stock {
  ddnStock: number;
  dlStock: number;
  godwanStock: number;
  ibStock: number;
  chdStock:number;
  mainStock: number;
  mtStock: number;
  smapleLine: number;
}

export interface Product {
  id?: string;
  image: string;
  brand: string;
  modelName: string;
  consumerOffer: number;
  mrp: number;
  totalStock: number;
  stockId: Stock;
}

export interface cart {
  product: Product;
  quantity: number;
}



export interface productMeta {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}