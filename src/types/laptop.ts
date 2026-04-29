export interface Laptop {
  id: number;
  model: string;
  brand: string;
  processor: string;
  graphics: string;
  display: string;
  memory: string;
  storage: string;
  os: string;
  color: string;
  condition: string;
  notes: string;
  price: number | null;
  category: string;
  image: string;
}

export interface StoreConfig {
  phone: string;
  whatsapp: string;
  location: string;
  hours: string;
  facebook: string;
  instagram: string;
  telegram: string;
}
