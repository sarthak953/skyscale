export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  categoryId: string;
  scale?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface BestSeller extends Product {}