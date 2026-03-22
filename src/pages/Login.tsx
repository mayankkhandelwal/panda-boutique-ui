import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const switchTab = (t: "login" | "register") => { setTab(t); setError(""); setSuccess(""); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);
    if (error) setError("Invalid email or password. Please try again.");
    else navigate("/");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (regForm.password !== regForm.confirm) { setError("Passwords do not match."); return; }
    if (!/^\d{10}$/.test(regForm.phone)) { setError("Enter a valid 10-digit phone number."); return; }
    if (regForm.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error } = await signUp(regForm.email, regForm.password, regForm.name, regForm.phone);
    setLoading(false);
    if (error) setError(error);
    else {
      setSuccess("Account created! Please check your email to verify, then login.");
      setTimeout(() => switchTab("login"), 2500);
    }
  };

  return (
    <main className="container max-w-md py-16 space-y-8 animate-fade-up">
      <div className="text-center space-y-2">
        <Link to="/" className="text-4xl inline-block">🐼</Link>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          {tab === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-muted-foreground text-sm">Estranged Panda</p>
      </div>

      <div className="flex bg-secondary rounded-xl p-1">
        {(["login", "register"] as const).map((t) => (
          <button key={t} onClick={() => switchTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors capitalize ${tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "login" ? "Login" : "Register"}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">⚠ {error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-400">✅ {success}</div>}

      {tab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          {[
            { key: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
            { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
          ].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">{f.label}</label>
              <input type={f.type} required placeholder={f.placeholder}
                value={loginForm[f.key as keyof typeof loginForm]}
                onChange={(e) => setLoginForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-foreground text-background font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button type="button" onClick={() => switchTab("register")} className="text-primary hover:underline">Register here</button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
            { key: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
            { key: "phone", label: "WhatsApp Number", type: "tel", placeholder: "10-digit mobile number" },
            { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
            { key: "confirm", label: "Confirm Password", type: "password", placeholder: "Repeat your password" },
          ].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">{f.label}</label>
              <input type={f.type} required placeholder={f.placeholder}
                value={regForm[f.key as keyof typeof regForm]}
                onChange={(e) => setRegForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-foreground text-background font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={() => switchTab("login")} className="text-primary hover:underline">Login here</button>
          </p>
        </form>
      )}
    </main>
  );
};

export default Login;
