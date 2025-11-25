export interface MenuItem {
  id: number | string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface MenuState {
  items: MenuItem[];
}