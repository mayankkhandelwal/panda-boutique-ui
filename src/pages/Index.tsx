import { useState } from "react";
import { products, Category } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const categories: Category[] = ["All", "Men", "Women", "Kids"];

const Index = () => {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="container relative z-10 text-center space-y-6 animate-fade-up">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[0.95]">
            Wear What Defines You
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto">
            Premium custom print clothing. Delivered across India.
          </p>
          <a
            href="#products"
            className="inline-block bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity active:scale-95"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container py-12 space-y-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap active:scale-95 ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
