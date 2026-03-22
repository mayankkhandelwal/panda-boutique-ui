import { useState, useEffect } from "react";
import { supabase, DbOrder } from "@/lib/supabase";
import { Package, ShoppingBag, TrendingUp, ExternalLink, Save } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Panda@2025!";

const STATUS_LABELS: Record<string, string> = {
  placed: "🟡 Placed",
  ordered_from_vendor: "🔵 Ordered from Printrove",
  shipped: "🚚 Shipped",
  delivered: "✅ Delivered",
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState<"orders" | "dashboard">("orders");
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [savingTracking, setSavingTracking] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPwError("Wrong password. Try again.");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setOrders(data as DbOrder[]);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  const updateStatus = async (orderId: string, status: string) => {
    setStatusSaving(orderId);
    await supabase.from("orders").update({ order_status: status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, order_status: status as DbOrder["order_status"] } : o));
    setStatusSaving(null);
  };

  const saveTracking = async (order: DbOrder) => {
    const tracking = trackingInputs[order.id];
    if (!tracking?.trim()) return;
    setSavingTracking(order.id);
    await supabase.from("orders").update({
      tracking_number: tracking,
      order_status: "shipped",
      tracking_notified: true,
    }).eq("id", order.id);
    setOrders((prev) => prev.map((o) =>
      o.id === order.id ? { ...o, tracking_number: tracking, order_status: "shipped", tracking_notified: true } : o
    ));
    setSavingTracking(null);
    alert(`✅ Tracking saved! Customer ${order.customer_name} will be notified on WhatsApp.`);
  };

  // Stats
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today);
  const totalRevenue = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
  const pendingVendor = orders.filter((o) => o.order_status === "placed").length;

  if (!authed) {
    return (
      <main className="container max-w-sm py-24 space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">🐼 Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Estranged Panda</p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {pwError && <p className="text-sm text-red-500">{pwError}</p>}
          <button onClick={handleLogin} className="w-full bg-foreground text-background font-bold py-3 rounded-lg hover:opacity-90">
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">🐼 Admin Panel</h1>
        <div className="flex gap-2">
          <button onClick={() => setTab("dashboard")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "dashboard" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            Dashboard
          </button>
          <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            Orders
          </button>
        </div>
      </div>

      {tab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><ShoppingBag className="w-4 h-4" /> Today's Orders</div>
            <p className="text-3xl font-bold">{todayOrders.length}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><TrendingUp className="w-4 h-4" /> Total Revenue</div>
            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Package className="w-4 h-4" /> Pending on Printrove</div>
            <p className="text-3xl font-bold text-amber-500">{pendingVendor}</p>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
            <button onClick={fetchOrders} className="text-sm text-primary hover:underline">Refresh</button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-secondary/30 border border-border rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-bold text-primary">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.total_amount.toLocaleString("en-IN")}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${order.payment_status === "paid" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-muted-foreground">{order.customer_phone}</p>
                      <p className="text-muted-foreground">{order.customer_email}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {order.delivery_address.address}, {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Items</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm">{item.name} — {item.color}, {item.size} × {item.qty} = ₹{item.price * item.qty}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                    <a
                      href="https://merchants.printrove.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Order on Printrove
                    </a>

                    <select
                      value={order.order_status}
                      disabled={statusSaving === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {!order.tracking_number && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Blue Dart tracking number"
                        value={trackingInputs[order.id] || ""}
                        onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                        className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <button
                        onClick={() => saveTracking(order)}
                        disabled={savingTracking === order.id}
                        className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {savingTracking === order.id ? "Saving..." : "Save & Notify"}
                      </button>
                    </div>
                  )}

                  {order.tracking_number && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-sm">
                      🚚 Blue Dart: <strong>{order.tracking_number}</strong>
                      {order.tracking_notified && <span className="ml-2 text-green-400 text-xs">Customer notified ✓</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Admin;
