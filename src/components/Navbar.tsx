import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-context";

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold tracking-tight text-foreground">
          <span className="text-2xl">🐼</span>
          Estranged Panda
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors active:scale-95"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
