import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = (location.state as { orderId?: string })?.orderId;

  if (!orderId) return <Navigate to="/" replace />;

  return (
    <main className="container max-w-lg py-16 md:py-24 text-center space-y-6 animate-fade-up">
      <CheckCircle className="w-20 h-20 text-success mx-auto" />
      <h1 className="font-display text-3xl md:text-4xl font-bold">Order Confirmed!</h1>
      <p className="text-muted-foreground">
        Thank you! Your Estranged Panda order has been confirmed.
      </p>
      <p className="text-sm font-medium">
        Order ID: <span className="text-primary">{orderId}</span>
      </p>

      <div className="bg-secondary/50 rounded-lg p-5 text-sm text-muted-foreground text-left space-y-2">
        <p>📦 We will place your order and ship it shortly. You will receive your Blue Dart tracking number on WhatsApp within 24-48 hours.</p>
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
