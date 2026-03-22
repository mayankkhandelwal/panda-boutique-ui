import { Link } from "react-router-dom";
import { Product, getDiscount } from "@/lib/store";

interface Props {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: Props) => {
  const discount = getDiscount(product.price, product.mrp);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-success text-success-foreground text-xs font-bold px-2 py-1 rounded">
          {discount}% OFF
        </span>
        <span className="absolute top-3 right-3 bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs font-medium px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-body font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">₹{product.price}</span>
          <span className="text-muted-foreground text-sm line-through">₹{product.mrp}</span>
        </div>
        <div className="flex gap-1.5 pt-1">
          {product.colors.map((c) => (
            <span
              key={c.name}
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
