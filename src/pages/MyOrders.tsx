import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase, DbOrder } from "@/lib/supabase";
import { Package } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-amber-500/20 text-amber-400",
  ordered_from_vendor: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
};

const STATUS_LABELS: Record<string, string> = {
  placed: "Order Placed",
  ordered_from_vendor: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as DbOrder[]);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading) return null;

  return (
    <main className="container max-w-2xl py-8 md:py-16 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">My Orders</h1>
        <Link to="/" className="text-sm text-primary hover:underline">Continue Shopping</Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Package className="w-16 h-16 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Link to="/" className="inline-block bg-foreground text-background font-bold px-6 py-3 rounded-lg hover:opacity-90">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-secondary/30 border border-border rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-bold text-primary">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[order.order_status]}`}>
                    {STATUS_LABELS[order.order_status]}
                  </span>
                  <span className="font-bold">₹{order.total_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} — {item.color}, {item.size} × {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground border-t border-border pt-3">
                📍 {order.delivery_address.address}, {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
              </div>

              {order.tracking_number && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2.5 text-sm space-y-1">
                  <p className="font-medium text-green-400">🚚 Your order is shipped!</p>
                  <p className="text-muted-foreground">Blue Dart Tracking: <strong className="text-foreground">{order.tracking_number}</strong></p>
                  <a
                    href={`https://www.bluedart.com/tracking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Track on Blue Dart →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyOrders;
