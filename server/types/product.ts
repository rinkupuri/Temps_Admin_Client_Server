export interface product {
  modelName: string;
  brand: string;
  image: string;
  mrp: number;
  totalStock: number;
  stock: AllLocationStock;
}
export interface AllLocationStock {
  mtStock: number;
  ibStock: number;
  ddnStock: number;
  dlStock: number;
  chdStock: number;
  mainStock: number;
  smapleLine: number;
  godwanStock: number;
}
