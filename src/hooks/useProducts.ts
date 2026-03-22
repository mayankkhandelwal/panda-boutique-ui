import { useEffect, useState } from "react";
import { supabase, DbProduct } from "@/lib/supabase";
import { Product } from "@/lib/store";

// Convert Supabase DB product to app Product format
const toAppProduct = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  price: p.price,
  mrp: p.mrp,
  image: p.image_url,
  category: p.category as Product["category"],
  colors: p.colors,
  sizes: p.sizes,
  description: p.description,
});

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setProducts((data as DbProduct[]).map(toAppProduct));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Using sample data.");
        // Fallback to static store data if Supabase fails
        const { products: staticProducts } = await import("@/lib/store");
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
