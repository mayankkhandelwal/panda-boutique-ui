import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured, DbProduct } from "@/lib/supabase";
import { Product, products as staticProducts } from "@/lib/store";

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
      // If Supabase not configured, use static data immediately
      if (!isSupabaseConfigured) {
        setProducts(staticProducts);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts((data as DbProduct[]).map(toAppProduct));
        } else {
          // DB is empty — use static fallback
          setProducts(staticProducts);
        }
      } catch (err) {
        console.error("Supabase error:", err);
        setError("Using sample products.");
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
