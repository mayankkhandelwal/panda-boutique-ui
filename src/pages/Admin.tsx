import { useState, useEffect, useRef } from "react";
import { supabase, DbOrder, DbProduct } from "@/lib/supabase";
import { Package, ShoppingBag, TrendingUp, ExternalLink, Save, Plus, Trash2, Pencil, X, Upload, ImageIcon } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Panda@2025!";

const STATUS_LABELS: Record<string, string> = {
  placed: "🟡 Placed",
  ordered_from_vendor: "🔵 Ordered from Printrove",
  shipped: "🚚 Shipped",
  delivered: "✅ Delivered",
};

const ALL_SIZES_MEN = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_SIZES_WOMEN = ["XS", "S", "M", "L", "XL"];
const ALL_SIZES_KIDS = ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "8-9Y", "10-11Y"];

const PRESET_COLORS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Navy", hex: "#1e2d4a" },
  { name: "Grey", hex: "#9e9e9e" },
  { name: "Olive", hex: "#556b2f" },
  { name: "Maroon", hex: "#6b0f0f" },
  { name: "Orange", hex: "#e85d2f" },
  { name: "Yellow", hex: "#f5c842" },
  { name: "Blue", hex: "#4a90d9" },
  { name: "Pink", hex: "#f4a7b9" },
  { name: "Lavender", hex: "#c084fc" },
  { name: "Cream", hex: "#e8d5c4" },
  { name: "Khaki", hex: "#c3b091" },
  { name: "Red", hex: "#ff5252" },
  { name: "Green", hex: "#2d6a4f" },
];

const emptyProductForm = {
  name: "",
  category: "Men" as "Men" | "Women" | "Kids",
  price: "",
  mrp: "",
  description: "",
  sizes: [] as string[],
  colors: [] as { name: string; hex: string }[],
  image_url: "",
};

// ── Admin Component ──────────────────────────────────────────────────────────
const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState<"orders" | "products" | "dashboard">("orders");

  // Orders state
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [savingTracking, setSavingTracking] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productError, setProductError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) setAuthed(true);
    else setPwError("Wrong password. Try again.");
  };

  // ── Fetch data ──────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as DbOrder[]);
    setOrdersLoading(false);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data as DbProduct[]);
    setProductsLoading(false);
  };

  useEffect(() => {
    if (authed) { fetchOrders(); fetchProducts(); }
  }, [authed]);

  // ── Order actions ───────────────────────────────────────────────────────
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
      tracking_number: tracking, order_status: "shipped", tracking_notified: true,
    }).eq("id", order.id);
    setOrders((prev) => prev.map((o) =>
      o.id === order.id ? { ...o, tracking_number: tracking, order_status: "shipped", tracking_notified: true } : o
    ));
    setSavingTracking(null);
    alert(`✅ Tracking saved! Customer ${order.customer_name} will be notified.`);
  };

  // ── Product form actions ────────────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setImageFile(null);
    setImagePreview("");
    setProductError("");
    setShowProductForm(true);
  };

  const openEditProduct = (p: DbProduct) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      mrp: String(p.mrp),
      description: p.description,
      sizes: p.sizes,
      colors: p.colors,
      image_url: p.image_url,
    });
    setImageFile(null);
    setImagePreview(p.image_url);
    setProductError("");
    setShowProductForm(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleSize = (size: string) => {
    setProductForm((p) => ({
      ...p,
      sizes: p.sizes.includes(size) ? p.sizes.filter((s) => s !== size) : [...p.sizes, size],
    }));
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    setProductForm((p) => {
      const exists = p.colors.find((c) => c.name === color.name);
      return {
        ...p,
        colors: exists ? p.colors.filter((c) => c.name !== color.name) : [...p.colors, color],
      };
    });
  };

  const saveProduct = async () => {
    setProductError("");
    if (!productForm.name.trim()) { setProductError("Product name is required."); return; }
    if (!productForm.price || !productForm.mrp) { setProductError("Price and MRP are required."); return; }
    if (productForm.sizes.length === 0) { setProductError("Select at least one size."); return; }
    if (productForm.colors.length === 0) { setProductError("Select at least one colour."); return; }
    if (!editingProduct && !imageFile && !productForm.image_url) { setProductError("Upload a product image."); return; }

    setSavingProduct(true);
    let imageUrl = productForm.image_url;

    // Upload image to Supabase Storage if new file selected
    if (imageFile) {
      setUploadingImage(true);
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${productForm.name.toLowerCase().replace(/\s+/g, "-")}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile, { upsert: true });
      setUploadingImage(false);

      if (uploadError) {
        setProductError("Image upload failed: " + uploadError.message);
        setSavingProduct(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
    }

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category,
      price: parseInt(productForm.price),
      mrp: parseInt(productForm.mrp),
      description: productForm.description.trim(),
      sizes: productForm.sizes,
      colors: productForm.colors,
      image_url: imageUrl,
      is_active: true,
    };

    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) { setProductError(error.message); setSavingProduct(false); return; }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { setProductError(error.message); setSavingProduct(false); return; }
    }

    setSavingProduct(false);
    setShowProductForm(false);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").update({ is_active: false }).eq("id", id);
    fetchProducts();
  };

  // ── Stats ───────────────────────────────────────────────────────────────
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today);
  const totalRevenue = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_amount, 0);
  const pendingVendor = orders.filter((o) => o.order_status === "placed").length;
  const sizeOptions = productForm.category === "Kids" ? ALL_SIZES_KIDS : productForm.category === "Women" ? ALL_SIZES_WOMEN : ALL_SIZES_MEN;

  // ── Login screen ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main className="container max-w-sm py-24 space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">🐼 Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Estranged Panda</p>
        </div>
        <div className="space-y-3">
          <input type="password" placeholder="Enter admin password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          {pwError && <p className="text-sm text-red-500">{pwError}</p>}
          <button onClick={handleLogin} className="w-full bg-foreground text-background font-bold py-3 rounded-lg hover:opacity-90">Login</button>
        </div>
      </main>
    );
  }

  // ── Main admin ──────────────────────────────────────────────────────────
  return (
    <main className="container py-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">🐼 Admin Panel</h1>
        <div className="flex gap-2">
          {(["dashboard", "orders", "products"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShoppingBag, label: "Today's Orders", value: todayOrders.length, color: "" },
            { icon: TrendingUp, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "" },
            { icon: Package, label: "Pending on Printrove", value: pendingVendor, color: "text-amber-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-secondary/50 rounded-xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><Icon className="w-4 h-4" />{label}</div>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
            <button onClick={fetchOrders} className="text-sm text-primary hover:underline">Refresh</button>
          </div>
          {ordersLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />)}</div>
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No orders yet.</p>
          ) : orders.map((order) => (
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
                <a href="https://merchants.printrove.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90">
                  <ExternalLink className="w-3.5 h-3.5" /> Order on Printrove
                </a>
                <select value={order.order_status} disabled={statusSaving === order.id}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              {!order.tracking_number && (
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter Blue Dart tracking number"
                    value={trackingInputs[order.id] || ""}
                    onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                    className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  <button onClick={() => saveTracking(order)} disabled={savingTracking === order.id}
                    className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60">
                    <Save className="w-3.5 h-3.5" />{savingTracking === order.id ? "Saving..." : "Save & Notify"}
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

      {/* PRODUCTS */}
      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{products.length} products</p>
            <button onClick={openAddProduct}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg hover:opacity-90 text-sm">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-secondary animate-pulse rounded-xl" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No products yet. Add your first product!</p>
              <button onClick={openAddProduct} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg">
                <Plus className="w-4 h-4" /> Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-secondary/30 border border-border rounded-xl overflow-hidden group">
                  <div className="relative aspect-square">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => openEditProduct(p)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-white" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)}
                        className="p-2 bg-red-500/60 hover:bg-red-500/80 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${p.is_active ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"}`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm">₹{p.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{p.mrp}</span>
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {p.colors.map((c) => (
                        <div key={c.name} title={c.name} className="w-4 h-4 rounded-full border border-border" style={{ background: c.hex }} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.sizes.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-2xl space-y-6 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowProductForm(false)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Product Image *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors"
                style={{ minHeight: 200 }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-56 gap-3 text-muted-foreground">
                    <Upload className="w-10 h-10" />
                    <p className="text-sm font-medium">Click to upload product image</p>
                    <p className="text-xs">JPG, PNG, WEBP — max 5MB</p>
                  </div>
                )}
                {imagePreview && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Change image
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Product Name *</label>
              <input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Panda Face Oversized Tee"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Category *</label>
              <div className="flex gap-2">
                {(["Men", "Women", "Kids"] as const).map((cat) => (
                  <button key={cat} type="button"
                    onClick={() => setProductForm((p) => ({ ...p, category: cat, sizes: [] }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${productForm.category === cat ? "bg-foreground text-background border-foreground" : "border-border hover:border-muted-foreground"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price and MRP */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Selling Price (₹) *</label>
                <input type="number" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="799"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">MRP / Original Price (₹) *</label>
                <input type="number" value={productForm.mrp} onChange={(e) => setProductForm((p) => ({ ...p, mrp: e.target.value }))}
                  placeholder="1199"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sizes Available *</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button key={size} type="button" onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${productForm.sizes.includes(size) ? "bg-foreground text-background border-foreground" : "border-border hover:border-muted-foreground"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Available Colours *</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => {
                  const selected = productForm.colors.find((c) => c.name === color.name);
                  return (
                    <button key={color.name} type="button" onClick={() => toggleColor(color)}
                      title={color.name}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${selected ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"}`}>
                      <span className="w-4 h-4 rounded-full inline-block border border-border/50" style={{ background: color.hex }} />
                      {color.name}
                    </button>
                  );
                })}
              </div>
              {productForm.colors.length > 0 && (
                <p className="text-xs text-muted-foreground">Selected: {productForm.colors.map((c) => c.name).join(", ")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                rows={3} placeholder="Describe fabric, fit, print details..."
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            {productError && <p className="text-sm text-red-500">⚠ {productError}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowProductForm(false)}
                className="flex-1 border border-border py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={saveProduct} disabled={savingProduct || uploadingImage}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-60">
                {uploadingImage ? "Uploading image..." : savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Admin;
