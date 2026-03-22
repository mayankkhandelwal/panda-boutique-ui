import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalAmount } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-lg font-bold">Your Cart ({totalItems} items)</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">Your cart is empty</p>
          ) : (
            items.map((item) => {
              const colorObj = item.product.colors.find((c) => c.name === item.color);
              return (
                <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex gap-3 bg-secondary/50 rounded-lg p-3">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover rounded" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-3 h-3 rounded-full border border-border inline-block" style={{ backgroundColor: colorObj?.hex }} />
                      {item.color} · {item.size}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary active:scale-95">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary active:scale-95">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-sm">₹{item.product.price * item.quantity}</span>
                      <button onClick={() => removeItem(item.product.id, item.color, item.size)} className="text-xs text-primary hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate("/checkout"); }}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
