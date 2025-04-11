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


export interface Task {
  id: string;
  createdAt: string;
  taskDesc: string;
  assignedById: string;
  assignedToId: string;
  taskStatus: "PENDING" | "INPROGRESS" | "REVISED" | "COMPLETED";
  taskPriority: "HIGH" | "MEDIUM" | "LOW";
  tatDate: string;
  tatTime: string;
  taskRemarks?: string;
}
