export type Category = "All" | "Men" | "Women" | "Kids";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  category: Category;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
}

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Panda Face Oversized Tee",
    price: 799, mrp: 1199,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Men",
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Charcoal", hex: "#333333" },
      { name: "Navy", hex: "#1e2d4a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium 220 GSM cotton oversized t-shirt with minimalist panda face print. Drop shoulders, ribbed collar, and a relaxed boxy fit.",
  },
  {
    id: "2",
    name: "Classic Logo Hoodie",
    price: 1499, mrp: 2199,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    category: "Men",
    colors: [
      { name: "White", hex: "#f5f5f5" },
      { name: "Grey", hex: "#9e9e9e" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Heavyweight 350 GSM fleece hoodie with embroidered panda logo. Kangaroo pocket, adjustable drawstring hood.",
  },
  {
    id: "3",
    name: "Cargo Joggers",
    price: 1299, mrp: 1899,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    category: "Men",
    colors: [
      { name: "Olive", hex: "#556b2f" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Khaki", hex: "#c3b091" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Utility cargo joggers in premium twill with panda patch detail. Elastic waistband and deep cargo pockets.",
  },
  {
    id: "4",
    name: "Abstract Art Crop Top",
    price: 699, mrp: 999,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    category: "Women",
    colors: [
      { name: "Orange", hex: "#e85d2f" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#f5f5f5" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Bold graphic crop top with abstract art print. Soft-touch cotton blend and relaxed fit.",
  },
  {
    id: "5",
    name: "Women Crop Hoodie",
    price: 1299, mrp: 1899,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    category: "Women",
    colors: [
      { name: "Cream", hex: "#e8d5c4" },
      { name: "Lavender", hex: "#c084fc" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cozy cropped hoodie with ribbed hem and cuffs. Premium fleece lining and adjustable hood.",
  },
  {
    id: "6",
    name: "Astro Panda Kids Tee",
    price: 599, mrp: 899,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80",
    category: "Kids",
    colors: [
      { name: "Orange", hex: "#e85d2f" },
      { name: "Yellow", hex: "#f5c842" },
      { name: "Blue", hex: "#4a90d9" },
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "8-9Y"],
    description: "Fun astronaut panda print tee for kids. Soft combed cotton, pre-shrunk with reinforced stitching.",
  },
];

export const getDiscount = (price: number, mrp: number) =>
  Math.round(((mrp - price) / mrp) * 100);
