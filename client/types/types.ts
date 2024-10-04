export interface Menu {
  id: string;
  name: string;
  link: string;
  image: string;
  desc: string;
}

enum Permission {
  products = "products",
  sheets = "sheets",
  orders = "orders",
  search = "search",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  Permission?: string[];
  role: "ADMIN" | "SUSER" | "USER";
}
