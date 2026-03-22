import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { usePlaceOrder } from "@/hooks/useOrders";

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { placeOrder } = usePlaceOrder();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "", state: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!/^\d{10}$/.test(form.phone)) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setFormError("Enter a valid 6-digit pincode.");
      return;
    }

    setSubmitting(true);
    const result = await placeOrder({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: {
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      cartItems: items,
      totalAmount,
    });

    setSubmitting(false);

    if (result.success) {
      clearCart();
      navigate("/order-success", {
        state: { orderId: result.orderNumber, customerName: form.name },
      });
    } else {
      setFormError(result.error || "Something went wrong. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-primary hover:underline">Continue Shopping</button>
      </div>
    );
  }

  return (
    <main className="container max-w-2xl py-8 md:py-16 space-y-8 animate-fade-up">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Delivery Details</h1>

      <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
        <h2 className="font-medium text-sm text-muted-foreground">Order Summary</h2>
        {items.map((item) => (
          <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex justify-between text-sm">
            <span>{item.product.name} ({item.color}, {item.size}) × {item.quantity}</span>
            <span>₹{item.product.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold border-t border-border pt-2">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {([
          { name: "name", label: "Full Name", type: "text" },
          { name: "email", label: "Email Address", type: "email" },
          { name: "phone", label: "WhatsApp Number", type: "tel" },
          { name: "address", label: "Full Address", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "pincode", label: "Pincode", type: "text" },
          { name: "state", label: "State", type: "text" },
        ] as const).map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              required
              value={form[field.name]}
              onChange={handleChange}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        ))}

        {formError && (
          <p className="text-sm text-red-500 font-medium">⚠ {formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full font-bold py-4 rounded-lg text-base transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#7c3aed", color: "white" }}
        >
          {submitting ? "Placing Order..." : `Pay ₹${totalAmount} via PhonePe 💜`}
        </button>
        <p className="text-xs text-muted-foreground text-center">UPI · Cards · Wallet · Net Banking</p>
        <p className="text-xs text-muted-foreground text-center">Your order details will be sent to your email and WhatsApp after payment</p>
      </form>
    </main>
  );
};

export default Checkout;
