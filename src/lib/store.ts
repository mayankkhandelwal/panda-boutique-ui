import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

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
    price: 799,
    mrp: 1199,
    image: product1,
    category: "Men",
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Charcoal", hex: "#333333" },
      { name: "Navy", hex: "#1e2d4a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium 220 GSM cotton oversized t-shirt with minimalist panda face print. Drop shoulders, ribbed collar, and a relaxed boxy fit that pairs effortlessly with joggers or jeans.",
  },
  {
    id: "2",
    name: "Classic Logo Hoodie",
    price: 1499,
    mrp: 2199,
    image: product2,
    category: "Men",
    colors: [
      { name: "White", hex: "#f5f5f5" },
      { name: "Grey", hex: "#9e9e9e" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Heavyweight 350 GSM fleece hoodie with embroidered panda logo. Kangaroo pocket, adjustable drawstring hood, and brushed interior for maximum warmth.",
  },
  {
    id: "3",
    name: "Cargo Joggers",
    price: 1299,
    mrp: 1899,
    image: product3,
    category: "Men",
    colors: [
      { name: "Olive", hex: "#556b2f" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Khaki", hex: "#c3b091" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Utility cargo joggers in premium twill with panda patch detail. Elastic waistband, tapered leg, and deep cargo pockets for everyday carry.",
  },
  {
    id: "4",
    name: "Abstract Art Crop Top",
    price: 699,
    mrp: 999,
    image: product4,
    category: "Women",
    colors: [
      { name: "Orange", hex: "#e85d2f" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#f5f5f5" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Bold graphic crop top with abstract art print. Soft-touch cotton blend, relaxed fit, and vibrant colour that makes a statement.",
  },
  {
    id: "5",
    name: "Contrast Polo Tee",
    price: 899,
    mrp: 1399,
    image: product5,
    category: "Men",
    colors: [
      { name: "Navy", hex: "#1e2d4a" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Classic polo tee with contrast tipping on collar and sleeves. Piqué cotton, two-button placket, and a tailored regular fit.",
  },
  {
    id: "6",
    name: "Astro Panda Kids Tee",
    price: 599,
    mrp: 899,
    image: product6,
    category: "Kids",
    colors: [
      { name: "Orange", hex: "#e85d2f" },
      { name: "Yellow", hex: "#f5c842" },
      { name: "Blue", hex: "#4a90d9" },
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "8-9Y"],
    description: "Fun astronaut panda print tee for kids. Soft combed cotton, pre-shrunk, with reinforced stitching that handles playground adventures.",
  },
];

export const getDiscount = (price: number, mrp: number) =>
  Math.round(((mrp - price) / mrp) * 100);
