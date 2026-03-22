import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId?: string; customerName?: string } | null;
  const orderId = state?.orderId;
  const customerName = state?.customerName;

  if (!orderId) return <Navigate to="/" replace />;

  return (
    <main className="container max-w-lg py-16 md:py-24 text-center space-y-6 animate-fade-up">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      <h1 className="font-display text-3xl md:text-4xl font-bold">Order Confirmed!</h1>
      <p className="text-muted-foreground">
        {customerName ? `Thank you, ${customerName}!` : "Thank you!"} Your Estranged Panda order has been confirmed.
      </p>
      <div className="bg-secondary/50 rounded-lg py-3 px-6 inline-block">
        <p className="text-sm text-muted-foreground">Order ID</p>
        <p className="text-xl font-bold text-primary">{orderId}</p>
      </div>

      <div className="bg-secondary/50 rounded-lg p-5 text-sm text-muted-foreground text-left space-y-3">
        <p>📧 Order confirmation sent to your email.</p>
        <p>💬 WhatsApp confirmation sent to your phone.</p>
        <p>📦 We will place your order on Printrove and ship it shortly. You will receive your <strong className="text-foreground">Blue Dart tracking number on WhatsApp within 24-48 hours.</strong></p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="w-full bg-foreground text-background font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        Continue Shopping
      </button>

      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-primary hover:underline"
      >
        Questions? Chat with us on WhatsApp
      </a>
    </main>
  );
};

export default OrderSuccess;
