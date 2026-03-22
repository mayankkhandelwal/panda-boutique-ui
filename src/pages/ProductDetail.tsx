import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products, getDiscount } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-primary hover:underline">Go back</button>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.mrp);

  const handleAdd = () => {
    addItem(product, product.colors[selectedColor].name, product.sizes[selectedSize], quantity);
  };

  return (
    <main className="container py-8 md:py-16">
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        ← Back
      </button>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden bg-secondary aspect-[4/5] animate-fade-in">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="space-y-6 animate-fade-up">
          <div>
            <span className="text-xs font-medium text-primary uppercase tracking-widest">{product.category}</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">₹{product.price}</span>
            <span className="text-muted-foreground line-through">₹{product.mrp}</span>
            <span className="text-success text-sm font-bold">{discount}% OFF</span>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Colour: <span className="text-foreground font-medium">{product.colors[selectedColor].name}</span></p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(i)}
                  className={`w-9 h-9 rounded-full border-2 transition-all active:scale-90 ${
                    i === selectedColor ? "border-primary scale-110" : "border-border hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors active:scale-95 ${
                    i === selectedSize
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary active:scale-95">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary active:scale-95">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            className="w-full bg-foreground text-background font-bold py-4 rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98] text-base"
          >
            Add to Cart
          </button>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
            {[
              { icon: Truck, text: "Free shipping above ₹999" },
              { icon: RotateCcw, text: "7-day easy returns" },
              { icon: ShieldCheck, text: "100% genuine product" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
