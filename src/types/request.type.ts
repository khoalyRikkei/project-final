// Type Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Product

export interface ProductRequest {
  name: string;
  price: number;
  image: File;
}
