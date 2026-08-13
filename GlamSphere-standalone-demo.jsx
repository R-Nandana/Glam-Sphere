import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Heart, ShoppingBag, Star, User, X, Menu, Sparkles, Droplet,
  Palette, MessageCircle, Send, ChevronRight, ChevronLeft, Plus, Minus,
  Trash2, Package, TrendingUp, Users, DollarSign, ClipboardList, Tag,
  BarChart3, LayoutDashboard, Check, LogOut, ArrowLeft, Filter as FilterIcon,
  Wand2, ShieldCheck, Truck
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

/* ============================== THEME ============================== */
const Theme = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
    :root{
      --bg:#FBF5F3; --surface:#FFFFFF; --ink:#2A1B22; --ink-soft:#6B5760;
      --line:#EFE1E0; --accent:#E8527A; --accent-ink:#8A1F3D; --accent-soft:#FBDDE5;
      --mauve:#8C6470; --gold:#B98A3E; --gold-soft:#F3E3C5; --mint:#3E9C82; --mint-soft:#DBF0E8;
      --shade1:#F7E1C8; --shade2:#EBC199; --shade3:#D9A06B; --shade4:#B67848; --shade5:#8A5233; --shade6:#5C3421;
    }
    .gs{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--bg); color:var(--ink); }
    .gs-display{ font-family:'Fraunces', serif; }
    .gs-mono{ font-family:'IBM Plex Mono', monospace; }
    .spectrum-bar{ height:6px; border-radius:999px; background:linear-gradient(90deg,var(--shade1),var(--shade2),var(--shade3),var(--shade4),var(--shade5),var(--shade6)); }
    .btn-primary{ background:var(--accent); color:#fff; border:none; font-weight:700; transition:transform .15s ease, background .15s ease; }
    .btn-primary:hover{ background:var(--accent-ink); transform:translateY(-1px); }
    .btn-outline{ background:transparent; border:1.5px solid var(--ink); color:var(--ink); font-weight:600; }
    .btn-outline:hover{ background:var(--ink); color:#fff; }
    .chip{ border:1.5px solid var(--line); background:#fff; font-weight:600; font-size:13px; transition:all .15s ease; }
    .chip.active{ background:var(--ink); border-color:var(--ink); color:#fff; }
    .card{ background:var(--surface); border:1px solid var(--line); border-radius:18px; }
    .card:hover .card-lift{ transform:translateY(-3px); }
    .swatch-badge{ width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 0 1px var(--line); }
    .scrollbar-thin::-webkit-scrollbar{ width:6px; height:6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb{ background:var(--line); border-radius:99px; }
    .admin-shell{ font-family:'Plus Jakarta Sans', sans-serif; background:#F7F5F3; color:var(--ink); }
    .side-link{ transition:all .12s ease; font-weight:600; color:var(--ink-soft); }
    .side-link.active{ background:var(--ink); color:#fff; }
    .side-link:hover:not(.active){ background:#EFE9E6; }
    .fade-in{ animation:fadeIn .25s ease; }
    @keyframes fadeIn{ from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:translateY(0);} }
    input:focus, select:focus, textarea:focus{ outline:2px solid var(--accent); outline-offset:1px; }
    button:focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }
  `}</style>
);

/* ============================== MOCK DATA ============================== */
const CATEGORIES = ["Skincare", "Makeup", "Haircare", "Fragrance", "Tools"];
const SKIN_TYPES = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];

const ICON_BY_CAT = { Skincare: Droplet, Makeup: Palette, Haircare: Sparkles, Fragrance: Wand2, Tools: ShieldCheck };
const GRADIENT_BY_CAT = {
  Skincare: "linear-gradient(135deg,#DDEFE9,#B7DED2)",
  Makeup: "linear-gradient(135deg,#FBDDE5,#F0AFC4)",
  Haircare: "linear-gradient(135deg,#F3E3C5,#E7C888)",
  Fragrance: "linear-gradient(135deg,#E6DEF5,#C9B6E8)",
  Tools: "linear-gradient(135deg,#E2E8EC,#B9C6D0)",
};

const PRODUCTS = [
  { id: 1, name: "Dew Drop Hydra Serum", brand: "Lumière Lab", category: "Skincare", price: 1299, mrp: 1599, rating: 4.6, reviews: 214, skinTypes: ["Dry","Normal","Sensitive"], trending: true, tags: ["hydrating","hyaluronic acid"], desc: "A featherlight serum that floods skin with moisture using triple-weight hyaluronic acid." },
  { id: 2, name: "Clarity Clay Cleanser", brand: "Bloomstead", category: "Skincare", price: 649, mrp: 799, rating: 4.3, reviews: 132, skinTypes: ["Oily","Combination"], trending: false, tags: ["oil-control","salicylic acid"], desc: "Kaolin clay and salicylic acid team up to clear pores without stripping skin." },
  { id: 3, name: "Velvet Matte Lipstick", brand: "Rue Noir", category: "Makeup", price: 899, mrp: 899, rating: 4.7, reviews: 512, skinTypes: [], shades: ["#B23A48","#8A2E3B","#D46A6A","#6E2430"], trending: true, tags: ["long-wear","matte"], desc: "A weightless matte that lasts through coffee, calls, and everything after." },
  { id: 4, name: "Skin Tint Second-Skin Foundation", brand: "Nū Cosmetics", category: "Makeup", price: 1499, mrp: 1499, rating: 4.5, reviews: 388, skinTypes: [], shades: ["#F7E1C8","#EBC199","#D9A06B","#B67848","#8A5233","#5C3421"], trending: true, tags: ["buildable","dewy finish"], desc: "Sheer-to-medium coverage that adapts to your skin tone and texture." },
  { id: 5, name: "Silk Repair Hair Oil", brand: "Bloomstead", category: "Haircare", price: 799, mrp: 999, rating: 4.4, reviews: 176, skinTypes: [], trending: false, tags: ["repair","frizz-control"], desc: "A featherweight blend of argan and camellia oil for glass-like shine." },
  { id: 6, name: "Volume Rice Water Shampoo", brand: "Kōdo", category: "Haircare", price: 549, mrp: 649, rating: 4.2, reviews: 98, skinTypes: [], trending: false, tags: ["volumizing","sulfate-free"], desc: "Fermented rice water strengthens strands from root to tip." },
  { id: 7, name: "Amber Dusk Eau de Parfum", brand: "Maison Vale", category: "Fragrance", price: 2999, mrp: 3499, rating: 4.8, reviews: 267, skinTypes: [], trending: true, tags: ["woody","evening"], desc: "Amber, sandalwood, and a whisper of smoked vanilla for after dark." },
  { id: 8, name: "Citrus Bloom Rollerball", brand: "Maison Vale", category: "Fragrance", price: 899, mrp: 899, rating: 4.1, reviews: 84, skinTypes: [], trending: false, tags: ["fresh","daytime"], desc: "Pocket-sized citrus and neroli for a mid-day refresh." },
  { id: 9, name: "Precision Vegan Brush Set (7pc)", brand: "Studio Line", category: "Tools", price: 1199, mrp: 1499, rating: 4.6, reviews: 145, skinTypes: [], trending: false, tags: ["vegan bristles","travel case"], desc: "Seven cruelty-free brushes for face and eyes, in a magnetic travel case." },
  { id: 10, name: "Ice Roller Depuff Wand", brand: "Studio Line", category: "Tools", price: 699, mrp: 899, rating: 4.0, reviews: 63, skinTypes: [], trending: false, tags: ["depuffing","cooling"], desc: "Stainless steel roller for a 60-second morning de-puff ritual." },
  { id: 11, name: "Overnight Retinol Renewal", brand: "Lumière Lab", category: "Skincare", price: 1699, mrp: 1999, rating: 4.5, reviews: 201, skinTypes: ["Normal","Combination","Dry"], trending: true, tags: ["anti-aging","night care"], desc: "Encapsulated retinol works while you sleep, with zero flaking drama." },
  { id: 12, name: "Featherlight Cream Blush", brand: "Rue Noir", category: "Makeup", price: 749, mrp: 749, rating: 4.4, reviews: 156, skinTypes: [], shades: ["#F2A6A0","#E17E88","#C9576B"], trending: false, tags: ["cream finish","buildable"], desc: "A cushiony cream blush that melts into skin for a flushed, lit-from-within look." },
];

const REVIEW_POOL = [
  { user: "Aanya R.", rating: 5, text: "Genuinely changed my routine — texture and finish are both excellent." },
  { user: "Meera S.", rating: 4, text: "Great product, wish the packaging was a bit more travel-friendly." },
  { user: "Kabir T.", rating: 5, text: "Repurchased twice already. Worth every rupee." },
  { user: "Priya D.", rating: 3, text: "Good but took a couple weeks to see the results everyone talks about." },
];

const CUSTOMERS = [
  { id: "C-1001", name: "Aanya Rao", email: "aanya.rao@mail.com", orders: 12, spent: 18420, joined: "Jan 2025" },
  { id: "C-1002", name: "Kabir Thomas", email: "kabir.t@mail.com", orders: 5, spent: 6890, joined: "Mar 2025" },
  { id: "C-1003", name: "Meera Shah", email: "meera.shah@mail.com", orders: 21, spent: 34210, joined: "Aug 2024" },
  { id: "C-1004", name: "Priya Deshmukh", email: "priya.d@mail.com", orders: 2, spent: 2140, joined: "Jun 2026" },
  { id: "C-1005", name: "Rohan Verma", email: "rohan.v@mail.com", orders: 8, spent: 11760, joined: "Nov 2025" },
];

const ADMIN_ORDERS = [
  { id: "GS-88231", customer: "Aanya Rao", items: 3, total: 3247, status: "Delivered", date: "Jul 21, 2026" },
  { id: "GS-88232", customer: "Kabir Thomas", items: 1, total: 899, status: "Shipped", date: "Jul 22, 2026" },
  { id: "GS-88233", customer: "Meera Shah", items: 5, total: 6120, status: "Processing", date: "Jul 22, 2026" },
  { id: "GS-88234", customer: "Priya Deshmukh", items: 2, total: 1548, status: "Delivered", date: "Jul 20, 2026" },
  { id: "GS-88235", customer: "Rohan Verma", items: 1, total: 2999, status: "Cancelled", date: "Jul 19, 2026" },
  { id: "GS-88236", customer: "Aanya Rao", items: 2, total: 2298, status: "Processing", date: "Jul 23, 2026" },
];

const COUPONS_SEED = [
  { code: "GLOW20", type: "Percentage", value: 20, uses: 341, active: true, expires: "Aug 31, 2026" },
  { code: "FIRST150", type: "Flat", value: 150, uses: 890, active: true, expires: "Dec 31, 2026" },
  { code: "MONSOON10", type: "Percentage", value: 10, uses: 120, active: false, expires: "Jul 15, 2026" },
];

const REVENUE_DATA = [
  { month: "Feb", revenue: 412000, orders: 980 },
  { month: "Mar", revenue: 468000, orders: 1050 },
  { month: "Apr", revenue: 441000, orders: 990 },
  { month: "May", revenue: 512000, orders: 1180 },
  { month: "Jun", revenue: 589000, orders: 1340 },
  { month: "Jul", revenue: 634000, orders: 1420 },
];

const CATEGORY_SALES = [
  { name: "Skincare", value: 34 }, { name: "Makeup", value: 29 },
  { name: "Haircare", value: 16 }, { name: "Fragrance", value: 13 }, { name: "Tools", value: 8 },
];
const PIE_COLORS = ["#3E9C82", "#E8527A", "#B98A3E", "#8C6470", "#6B5760"];

const rupee = (n) => "₹" + n.toLocaleString("en-IN");

/* ============================== SMALL UI PARTS ============================== */
const StarRow = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size} fill={i <= Math.round(rating) ? "var(--gold)" : "none"} color="var(--gold)" strokeWidth={1.5} />
    ))}
  </div>
);

const Pill = ({ children, tone = "ink" }) => {
  const tones = {
    ink: { background: "var(--ink)", color: "#fff" },
    accent: { background: "var(--accent-soft)", color: "var(--accent-ink)" },
    mint: { background: "var(--mint-soft)", color: "var(--mint)" },
    gold: { background: "var(--gold-soft)", color: "var(--gold)" },
  };
  return <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={tones[tone]}>{children}</span>;
};

function ProductCard({ p, onOpen, wishlist, toggleWishlist, addToCart }) {
  const Icon = ICON_BY_CAT[p.category];
  return (
    <div className="card group relative overflow-hidden fade-in" style={{ cursor: "pointer" }}>
      <div onClick={() => onOpen(p)} className="card-lift" style={{ transition: "transform .2s ease" }}>
        <div className="relative flex items-center justify-center" style={{ height: 168, background: GRADIENT_BY_CAT[p.category], borderRadius: "18px 18px 0 0" }}>
          <Icon size={40} strokeWidth={1.3} color="var(--ink)" style={{ opacity: 0.55 }} />
          {p.trending && <div className="absolute top-3 left-3"><Pill tone="accent">Trending</Pill></div>}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
            className="absolute top-3 right-3 flex items-center justify-center"
            style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff" }}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={wishlist.includes(p.id) ? "var(--accent)" : "none"} color="var(--accent)" />
          </button>
        </div>
        <div className="p-4">
          <div className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>{p.brand}</div>
          <div className="gs-display font-semibold" style={{ fontSize: 16, marginTop: 2 }}>{p.name}</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRow rating={p.rating} />
            <span className="text-xs" style={{ color: "var(--ink-soft)" }}>({p.reviews})</span>
          </div>
          {p.shades && (
            <div className="flex items-center gap-1 mt-2">
              {p.shades.slice(0,5).map((s,i) => <span key={i} className="swatch-badge" style={{ background: s }} />)}
            </div>
          )}
          <div className="flex items-end justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold" style={{ fontSize: 17 }}>{rupee(p.price)}</span>
              {p.mrp > p.price && <span className="text-xs line-through" style={{ color: "var(--ink-soft)" }}>{rupee(p.mrp)}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button onClick={() => addToCart(p)} className="btn-primary w-full py-2 rounded-full text-sm flex items-center justify-center gap-1.5">
          <ShoppingBag size={15} /> Add to bag
        </button>
      </div>
    </div>
  );
}

/* ============================== CHATBOT ============================== */
function botReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes("oily")) return "For oily skin, look for lightweight, oil-free formulas with salicylic acid or niacinamide — the Clarity Clay Cleanser is a great start. Want me to build you a routine?";
  if (m.includes("dry")) return "Dry skin loves layered hydration — try the Dew Drop Hydra Serum under a richer moisturizer, and skip hot water cleansing. Want a full routine?";
  if (m.includes("routine")) return "A simple AM routine: cleanse → hydrating serum → SPF. PM: cleanse → treatment (like retinol) → moisturizer. Want product picks for your skin type?";
  if (m.includes("shade") || m.includes("foundation")) return "Try the Shade Finder tool from the nav bar — tell it your undertone and depth and I'll match you to a foundation shade in seconds.";
  if (m.includes("retinol")) return "Start retinol 2–3 nights a week, always follow with moisturizer, and wear SPF the next morning without fail — retinol increases sun sensitivity.";
  if (m.includes("hi") || m.includes("hello") || m.includes("hey")) return "Hey! I'm your GlamSphere beauty advisor. Ask me about skin types, routines, ingredients, or shade matching.";
  if (m.includes("thank")) return "Anytime — glowing skin is a team effort. 🌿";
  return "Good question! I'd recommend starting with our Skin Type Quiz so I can tailor advice to you specifically — or ask me about a specific concern like acne, dryness, or dullness.";
}

function Chatbot({ open, setOpen }) {
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi, I'm Glow — your AI beauty advisor. Ask me anything about skincare, routines, or shade matching." }]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = (text) => {
    const t = text ?? input;
    if (!t.trim()) return;
    setMessages(m => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => setMessages(m => [...m, { from: "bot", text: botReply(t) }]), 500);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary fixed rounded-full flex items-center gap-2 px-5 py-3 shadow-lg" style={{ bottom: 24, right: 24, zIndex: 50 }}>
        <MessageCircle size={18} /> Ask Glow
      </button>
    );
  }
  return (
    <div className="fixed card fade-in flex flex-col" style={{ bottom: 24, right: 24, width: 340, height: 460, zIndex: 50, boxShadow: "0 20px 50px rgba(42,27,34,0.25)" }}>
      <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: "var(--accent-soft)" }}>
            <Sparkles size={15} color="var(--accent-ink)" />
          </div>
          <div>
            <div className="font-bold text-sm">Glow — Beauty AI</div>
            <div className="text-xs" style={{ color: "var(--mint)" }}>● Online</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "bot" ? "flex-start" : "flex-end" }}>
            <div className="text-sm px-3 py-2" style={{
              maxWidth: "85%", borderRadius: 14,
              background: m.from === "bot" ? "#F3ECEB" : "var(--accent)",
              color: m.from === "bot" ? "var(--ink)" : "#fff"
            }}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-1.5 p-2 flex-wrap px-3">
        {["Oily skin tips","Build me a routine","Help with shades"].map(q => (
          <button key={q} onClick={() => send(q)} className="chip px-2.5 py-1 rounded-full">{q}</button>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3" style={{ borderTop: "1px solid var(--line)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about skincare..." className="flex-1 text-sm px-3 py-2 rounded-full" style={{ border: "1px solid var(--line)" }} />
        <button onClick={() => send()} className="btn-primary flex items-center justify-center rounded-full" style={{ width: 34, height: 34 }}><Send size={15} /></button>
      </div>
    </div>
  );
}

/* ============================== SKIN QUIZ ============================== */
function SkinQuiz({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { key: "feel", q: "How does your skin feel by midday?", options: ["Shiny & greasy", "Tight & flaky", "Oily T-zone, dry cheeks", "Comfortable & balanced"] },
    { key: "pores", q: "How visible are your pores?", options: ["Large, especially T-zone", "Barely visible", "Visible only in T-zone", "Small and even"] },
    { key: "sensitivity", q: "Does your skin react easily to new products?", options: ["Rarely", "Sometimes", "Often — redness or itching", "Never tried much"] },
    { key: "goal", q: "What's your top skin goal right now?", options: ["Control oil & shine", "Deep hydration", "Even out texture", "Overall maintenance"] },
  ];
  const mapResult = () => {
    const vals = Object.values(answers);
    if (vals.filter(v => v.includes("greasy") || v.includes("oil")).length >= 2) return "Oily";
    if (vals.filter(v => v.includes("tight") || v.includes("flaky") || v.includes("Hydration")).length >= 2) return "Dry";
    if (vals.some(v => v.includes("T-zone"))) return "Combination";
    if (vals.some(v => v.includes("redness") || v.includes("itching"))) return "Sensitive";
    return "Normal";
  };
  const q = questions[step];
  return (
    <div className="max-w-xl mx-auto py-10 px-4 fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: "var(--ink-soft)" }}><ArrowLeft size={15}/> Back to shop</button>
      <div className="text-xs font-bold gs-mono" style={{ color: "var(--accent)" }}>SKIN TYPE QUIZ · {step+1} OF {questions.length}</div>
      <div className="spectrum-bar my-3" style={{ width: `${((step+1)/questions.length)*100}%`, opacity: 0.9 }} />
      <h2 className="gs-display font-semibold text-2xl mt-4 mb-6">{q.q}</h2>
      <div className="space-y-3">
        {q.options.map(opt => (
          <button key={opt} onClick={() => {
            const next = { ...answers, [q.key]: opt };
            setAnswers(next);
            if (step < questions.length - 1) setStep(step + 1);
            else onComplete(mapResult());
          }} className="card w-full text-left p-4 flex items-center justify-between" style={{ transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}>
            <span className="font-medium">{opt}</span>
            <ChevronRight size={16} color="var(--ink-soft)" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================== SHADE FINDER ============================== */
function ShadeFinder({ onBack }) {
  const [undertone, setUndertone] = useState(null);
  const [depth, setDepth] = useState(2);
  const depths = ["#F7E1C8","#EBC199","#D9A06B","#B67848","#8A5233","#5C3421"];
  const foundation = PRODUCTS.find(p => p.name.includes("Foundation"));
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: "var(--ink-soft)" }}><ArrowLeft size={15}/> Back to shop</button>
      <div className="text-xs font-bold gs-mono" style={{ color: "var(--accent)" }}>AI SHADE FINDER</div>
      <h2 className="gs-display font-semibold text-2xl mt-2 mb-6">Find your exact match</h2>

      <div className="mb-7">
        <div className="font-semibold mb-3">1. Pick your undertone</div>
        <div className="flex gap-3">
          {["Cool","Neutral","Warm"].map(u => (
            <button key={u} onClick={() => setUndertone(u)} className={`chip px-4 py-2 rounded-full ${undertone===u ? "active":""}`}>{u}</button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="font-semibold mb-3">2. Match your depth</div>
        <div className="spectrum-bar mb-3" />
        <input type="range" min={0} max={5} value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between mt-3">
          {depths.map((d,i) => <span key={i} className="swatch-badge" style={{ background: d, width: 22, height: 22, outline: i===depth ? "2px solid var(--ink)" : "none", outlineOffset: 2 }} />)}
        </div>
      </div>

      {undertone && (
        <div className="card p-5 flex gap-4 items-center fade-in">
          <span className="swatch-badge" style={{ background: depths[depth], width: 48, height: 48 }} />
          <div className="flex-1">
            <div className="text-xs font-bold" style={{ color: "var(--mint)" }}>MATCH FOUND</div>
            <div className="font-bold gs-display text-lg">{foundation.name}</div>
            <div className="text-sm" style={{ color: "var(--ink-soft)" }}>{undertone} undertone · Shade {depth+1} of 6</div>
          </div>
          <Pill tone="mint">96% match</Pill>
        </div>
      )}
    </div>
  );
}

/* ============================== CUSTOMER APP ============================== */
function CustomerApp({ toAdmin }) {
  const [view, setView] = useState("home"); // home, product, wishlist, cart, checkout, orders, quiz, shade, auth
  const [activeProduct, setActiveProduct] = useState(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [wishlist, setWishlist] = useState([3, 7]);
  const [cart, setCart] = useState([{ id: 4, qty: 1, shade: "#EBC199" }]);
  const [chatOpen, setChatOpen] = useState(false);
  const [skinResult, setSkinResult] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const [toast, setToast] = useState(null);
  const [orders] = useState([
    { id: "GS-77120", date: "Jun 30, 2026", items: ["Dew Drop Hydra Serum", "Velvet Matte Lipstick"], total: 2198, status: "Delivered" },
    { id: "GS-79004", date: "Jul 12, 2026", items: ["Amber Dusk Eau de Parfum"], total: 2999, status: "Delivered" },
    { id: "GS-81233", date: "Jul 21, 2026", items: ["Skin Tint Second-Skin Foundation"], total: 1499, status: "Shipped" },
  ]);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 1800); };
  const toggleWishlist = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const addToCart = (p, shade) => {
    setCart(c => {
      const existing = c.find(x => x.id === p.id && (shade ? x.shade === shade : true));
      if (existing) return c.map(x => x === existing ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { id: p.id, qty: 1, shade: shade || (p.shades ? p.shades[0] : undefined) }];
    });
    showToast(`Added ${p.name} to your bag`);
  };
  const updateQty = (idx, delta) => setCart(c => c.map((x,i) => i===idx ? { ...x, qty: Math.max(1, x.qty + delta) } : x).filter(x => x.qty > 0));
  const removeFromCart = (idx) => setCart(c => c.filter((_,i) => i !== idx));

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())))
    );
    if (sort === "price-low") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a,b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a,b) => b.rating - a.rating);
    return list;
  }, [category, search, sort]);

  const trending = PRODUCTS.filter(p => p.trending);
  const cartDetailed = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.id) }));
  const cartTotal = cartDetailed.reduce((s,c) => s + c.product.price * c.qty, 0);
  const recommended = skinResult ? PRODUCTS.filter(p => p.skinTypes?.includes(skinResult)) : [];
  const similar = activeProduct ? PRODUCTS.filter(p => p.category === activeProduct.category && p.id !== activeProduct.id).slice(0,4) : [];

  const Header = () => (
    <div className="sticky top-0 z-40" style={{ background: "rgba(251,245,243,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between px-6 py-3.5 gap-4 max-w-[1200px] mx-auto">
        <div onClick={() => setView("home")} className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: "var(--ink)" }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span className="gs-display font-bold text-xl">GlamSphere</span>
        </div>
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5" color="var(--ink-soft)" />
          <input value={search} onChange={e => { setSearch(e.target.value); setView("home"); }} placeholder="Search shades, brands, concerns..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm" style={{ border: "1px solid var(--line)", background: "#fff" }} />
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setView("quiz")} className="hidden md:flex items-center gap-1.5 chip px-3 py-2 rounded-full"><Wand2 size={14}/> Skin Quiz</button>
          <button onClick={() => setView("shade")} className="hidden md:flex items-center gap-1.5 chip px-3 py-2 rounded-full"><Palette size={14}/> Shade Finder</button>
          <button onClick={() => setView("wishlist")} className="relative p-2.5" aria-label="Wishlist">
            <Heart size={19} />
            {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 gs-mono text-white flex items-center justify-center" style={{ background: "var(--accent)", borderRadius: 99, fontSize: 10, width: 16, height: 16 }}>{wishlist.length}</span>}
          </button>
          <button onClick={() => setView("cart")} className="relative p-2.5" aria-label="Cart">
            <ShoppingBag size={19} />
            {cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 gs-mono text-white flex items-center justify-center" style={{ background: "var(--accent)", borderRadius: 99, fontSize: 10, width: 16, height: 16 }}>{cart.length}</span>}
          </button>
          <button onClick={() => setView("orders")} className="p-2.5" aria-label="Account"><User size={19} /></button>
          <button onClick={toAdmin} className="btn-outline text-xs px-3 py-2 rounded-full ml-1 hidden lg:block">Admin view</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="gs min-h-screen">
      <Header />
      {toast && <div className="fixed z-50 fade-in px-4 py-2.5 rounded-full text-sm font-semibold text-white flex items-center gap-2" style={{ top: 80, left: "50%", transform: "translateX(-50%)", background: "var(--ink)" }}><Check size={14}/> {toast}</div>}

      {view === "home" && (
        <div className="fade-in">
          <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Pill tone="accent">AI-Personalized Beauty</Pill>
                <h1 className="gs-display font-semibold mt-4" style={{ fontSize: "clamp(32px,4.5vw,52px)", lineHeight: 1.05 }}>Skincare and shades, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>matched to you.</em></h1>
                <p className="mt-4" style={{ color: "var(--ink-soft)", fontSize: 16 }}>Take the 60-second skin quiz, find your exact foundation shade, and get recommendations that actually fit your skin.</p>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setView("quiz")} className="btn-primary px-5 py-3 rounded-full text-sm">Take the Skin Quiz</button>
                  <button onClick={() => setView("shade")} className="btn-outline px-5 py-3 rounded-full text-sm">Find My Shade</button>
                </div>
              </div>
              <div className="spectrum-bar" style={{ height: 220, borderRadius: 24 }} />
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} color="var(--accent)" /><h2 className="gs-display font-semibold text-xl">Trending now</h2></div>
            <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
              {trending.map(p => <div key={p.id} style={{ minWidth: 240 }}><ProductCard p={p} onOpen={(p)=>{setActiveProduct(p); setView("product");}} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} /></div>)}
            </div>
          </div>

          {skinResult && recommended.length > 0 && (
            <div className="max-w-[1200px] mx-auto px-6 py-6">
              <div className="flex items-center gap-2 mb-1"><Sparkles size={18} color="var(--mint)" /><h2 className="gs-display font-semibold text-xl">Picked for your {skinResult.toLowerCase()} skin</h2></div>
              <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>Based on your Skin Type Quiz result.</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                {recommended.map(p => <ProductCard key={p.id} p={p} onOpen={(p)=>{setActiveProduct(p); setView("product");}} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
              </div>
            </div>
          )}

          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <h2 className="gs-display font-semibold text-xl mb-4">Shop all products</h2>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {["All", ...CATEGORIES].map(c => <button key={c} onClick={() => setCategory(c)} className={`chip px-3.5 py-1.5 rounded-full ${category===c?"active":""}`}>{c}</button>)}
              <select value={sort} onChange={e => setSort(e.target.value)} className="chip px-3 py-1.5 rounded-full ml-auto text-sm">
                <option value="relevance">Sort: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "var(--ink-soft)" }}>No products match "{search}". Try a different search.</div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                {filtered.map(p => <ProductCard key={p.id} p={p} onOpen={(p)=>{setActiveProduct(p); setView("product");}} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "product" && activeProduct && (
        <div className="max-w-[1000px] mx-auto px-6 py-8 fade-in">
          <button onClick={() => setView("home")} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: "var(--ink-soft)" }}><ArrowLeft size={15}/> Back to shop</button>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex items-center justify-center" style={{ height: 380, background: GRADIENT_BY_CAT[activeProduct.category], borderRadius: 24 }}>
              {React.createElement(ICON_BY_CAT[activeProduct.category], { size: 72, strokeWidth: 1.2, style: { opacity: 0.5 } })}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>{activeProduct.brand}</div>
              <h1 className="gs-display font-semibold text-3xl mt-1">{activeProduct.name}</h1>
              <div className="flex items-center gap-2 mt-3"><StarRow rating={activeProduct.rating} /><span className="text-sm" style={{ color: "var(--ink-soft)" }}>{activeProduct.rating} ({activeProduct.reviews} reviews)</span></div>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-extrabold text-2xl">{rupee(activeProduct.price)}</span>
                {activeProduct.mrp > activeProduct.price && <span className="line-through" style={{ color: "var(--ink-soft)" }}>{rupee(activeProduct.mrp)}</span>}
                {activeProduct.mrp > activeProduct.price && <Pill tone="mint">{Math.round((1-activeProduct.price/activeProduct.mrp)*100)}% off</Pill>}
              </div>
              <p className="mt-4" style={{ color: "var(--ink-soft)" }}>{activeProduct.desc}</p>
              {activeProduct.shades && (
                <div className="mt-5">
                  <div className="font-semibold text-sm mb-2">Shades</div>
                  <div className="flex gap-2">{activeProduct.shades.map((s,i) => <span key={i} className="swatch-badge" style={{ background: s, width: 26, height: 26 }} />)}</div>
                </div>
              )}
              <div className="flex items-center gap-2 mt-5 text-sm" style={{ color: "var(--mint)" }}><Truck size={16}/> Free delivery · Usually dispatched in 24 hrs</div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => addToCart(activeProduct)} className="btn-primary flex-1 py-3 rounded-full flex items-center justify-center gap-2"><ShoppingBag size={16}/> Add to bag</button>
                <button onClick={() => toggleWishlist(activeProduct.id)} className="btn-outline px-4 py-3 rounded-full"><Heart size={18} fill={wishlist.includes(activeProduct.id) ? "var(--accent)" : "none"} color="var(--accent)" /></button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="gs-display font-semibold text-xl mb-4">Reviews</h3>
            <div className="space-y-4">
              {REVIEW_POOL.map((r,i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center justify-between"><span className="font-semibold text-sm">{r.user}</span><StarRow rating={r.rating} size={13} /></div>
                  <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="gs-display font-semibold text-xl mb-4">You may also like</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {similar.map(p => <ProductCard key={p.id} p={p} onOpen={(p)=>{setActiveProduct(p); window.scrollTo(0,0);}} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
            </div>
          </div>
        </div>
      )}

      {view === "wishlist" && (
        <div className="max-w-[1200px] mx-auto px-6 py-8 fade-in">
          <h1 className="gs-display font-semibold text-2xl mb-6">Your Wishlist</h1>
          {wishlist.length === 0 ? <div className="text-center py-16" style={{ color: "var(--ink-soft)" }}>Nothing saved yet — tap the heart on any product.</div> : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {PRODUCTS.filter(p => wishlist.includes(p.id)).map(p => <ProductCard key={p.id} p={p} onOpen={(p)=>{setActiveProduct(p); setView("product");}} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
            </div>
          )}
        </div>
      )}

      {view === "cart" && (
        <div className="max-w-3xl mx-auto px-6 py-8 fade-in">
          <h1 className="gs-display font-semibold text-2xl mb-6">Your Bag</h1>
          {cartDetailed.length === 0 ? <div className="text-center py-16" style={{ color: "var(--ink-soft)" }}>Your bag is empty.</div> : (
            <>
              <div className="space-y-3">
                {cartDetailed.map((c,i) => (
                  <div key={i} className="card p-4 flex items-center gap-4">
                    <div className="flex items-center justify-center" style={{ width: 64, height: 64, background: GRADIENT_BY_CAT[c.product.category], borderRadius: 14 }}>
                      {React.createElement(ICON_BY_CAT[c.product.category], { size: 24, strokeWidth: 1.3, style: { opacity: 0.5 } })}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{c.product.name}</div>
                      <div className="text-sm" style={{ color: "var(--ink-soft)" }}>{c.product.brand}{c.shade && <> · <span className="swatch-badge" style={{ background: c.shade, display:"inline-block", verticalAlign:"middle" }}/></>}</div>
                    </div>
                    <div className="flex items-center gap-2 chip rounded-full px-2 py-1">
                      <button onClick={() => updateQty(i,-1)}><Minus size={14}/></button>
                      <span className="text-sm font-semibold w-4 text-center">{c.qty}</span>
                      <button onClick={() => updateQty(i,1)}><Plus size={14}/></button>
                    </div>
                    <div className="font-bold w-20 text-right">{rupee(c.product.price * c.qty)}</div>
                    <button onClick={() => removeFromCart(i)} aria-label="Remove"><Trash2 size={16} color="var(--ink-soft)" /></button>
                  </div>
                ))}
              </div>
              <div className="card p-5 mt-6 flex items-center justify-between">
                <div>
                  <div className="text-sm" style={{ color: "var(--ink-soft)" }}>Subtotal</div>
                  <div className="font-extrabold text-2xl">{rupee(cartTotal)}</div>
                </div>
                <button onClick={() => setView("checkout")} className="btn-primary px-6 py-3 rounded-full">Checkout</button>
              </div>
            </>
          )}
        </div>
      )}

      {view === "checkout" && (
        <CheckoutView cartTotal={cartTotal} cartDetailed={cartDetailed} onPlaced={() => { setView("orders"); showToast("Order placed successfully!"); setCart([]); }} onBack={() => setView("cart")} />
      )}

      {view === "orders" && (
        <div className="max-w-3xl mx-auto px-6 py-8 fade-in">
          <h1 className="gs-display font-semibold text-2xl mb-6">Order History</h1>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold gs-mono text-sm">{o.id}</div>
                  <Pill tone={o.status === "Delivered" ? "mint" : "gold"}>{o.status}</Pill>
                </div>
                <div className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>{o.date} · {o.items.join(", ")}</div>
                <div className="font-bold mt-2">{rupee(o.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "quiz" && <SkinQuiz onBack={() => setView("home")} onComplete={(r) => { setSkinResult(r); setView("home"); showToast(`Your skin type: ${r}`); }} />}
      {view === "shade" && <ShadeFinder onBack={() => setView("home")} />}

      <Chatbot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

function CheckoutView({ cartTotal, cartDetailed, onPlaced, onBack }) {
  const [step, setStep] = useState(1);
  return (
    <div className="max-w-xl mx-auto px-6 py-8 fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: "var(--ink-soft)" }}><ArrowLeft size={15}/> Back to bag</button>
      <h1 className="gs-display font-semibold text-2xl mb-6">Secure Checkout</h1>
      <div className="flex items-center gap-2 mb-6">
        {["Address","Payment","Confirm"].map((s,i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full font-bold text-xs" style={{ width: 24, height: 24, background: step >= i+1 ? "var(--accent)" : "var(--line)", color: step >= i+1 ? "#fff" : "var(--ink-soft)" }}>{i+1}</div>
            <span className="text-sm font-semibold" style={{ color: step >= i+1 ? "var(--ink)" : "var(--ink-soft)" }}>{s}</span>
            {i < 2 && <div style={{ width: 24, height: 1, background: "var(--line)" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card p-5 space-y-3">
          <input placeholder="Full name" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="Aanya Rao" />
          <input placeholder="Address" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="21 Lotus Enclave, Coimbatore" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" className="px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="Coimbatore" />
            <input placeholder="PIN code" className="px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="641001" />
          </div>
          <button onClick={() => setStep(2)} className="btn-primary w-full py-3 rounded-full mt-2">Continue to payment</button>
        </div>
      )}
      {step === 2 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold mb-1"><ShieldCheck size={16} color="var(--mint)"/> Payments secured via Razorpay / Stripe</div>
          <input placeholder="Card number" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="4242 4242 4242 4242" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="MM/YY" className="px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="09/28" />
            <input placeholder="CVV" className="px-3 py-2.5 rounded-lg text-sm" style={{ border: "1px solid var(--line)" }} defaultValue="123" />
          </div>
          <button onClick={() => setStep(3)} className="btn-primary w-full py-3 rounded-full mt-2">Review order</button>
        </div>
      )}
      {step === 3 && (
        <div className="card p-5">
          <div className="space-y-2 mb-4">
            {cartDetailed.map((c,i) => <div key={i} className="flex justify-between text-sm"><span>{c.product.name} × {c.qty}</span><span className="font-semibold">{rupee(c.product.price*c.qty)}</span></div>)}
          </div>
          <div className="flex justify-between font-bold text-lg pt-3" style={{ borderTop: "1px solid var(--line)" }}><span>Total</span><span>{rupee(cartTotal)}</span></div>
          <button onClick={onPlaced} className="btn-primary w-full py-3 rounded-full mt-4">Place order</button>
        </div>
      )}
    </div>
  );
}

/* ============================== ADMIN APP ============================== */
function AdminApp({ toCustomer }) {
  const [tab, setTab] = useState("dashboard");
  const [coupons, setCoupons] = useState(COUPONS_SEED);
  const [ordersState, setOrdersState] = useState(ADMIN_ORDERS);
  const [inventory, setInventory] = useState(PRODUCTS.map(p => ({ ...p, stock: [42,8,120,65,3,90,55,17,30,12,75,24][p.id-1] ?? 20 })));
  const [custSearch, setCustSearch] = useState("");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "analytics", label: "Sales Analytics", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "orders", label: "Order Tracking", icon: ClipboardList },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "revenue", label: "Revenue Reports", icon: DollarSign },
  ];

  const totalRevenue = REVENUE_DATA.reduce((s,r) => s + r.revenue, 0);
  const totalOrders = REVENUE_DATA.reduce((s,r) => s + r.orders, 0);
  const avgOrder = Math.round(totalRevenue / totalOrders);

  const StatCard = ({ icon: Icon, label, value, tone, sub }) => (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 38, height: 38, background: tone }}><Icon size={18} color="var(--ink)" /></div>
      </div>
      <div className="gs-display font-bold text-2xl mt-3">{value}</div>
      <div className="text-sm" style={{ color: "var(--ink-soft)" }}>{label}</div>
      {sub && <div className="text-xs font-semibold mt-1" style={{ color: "var(--mint)" }}>{sub}</div>}
    </div>
  );

  const statusTone = (s) => s === "Delivered" ? "mint" : s === "Cancelled" ? "accent" : "gold";

  return (
    <div className="admin-shell min-h-screen flex">
      <div className="hidden md:flex flex-col p-4" style={{ width: 232, borderRight: "1px solid var(--line)", background: "#fff" }}>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: "var(--ink)" }}><Sparkles size={15} color="#fff" /></div>
          <span className="gs-display font-bold">GlamSphere</span>
        </div>
        <div className="space-y-1 flex-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`side-link w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm ${tab===t.id?"active":""}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
        <button onClick={toCustomer} className="side-link w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm"><LogOut size={16}/> Exit to storefront</button>
      </div>

      <div className="flex-1 p-6 md:p-8 overflow-y-auto" style={{ maxHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="gs-display font-semibold text-2xl">{tabs.find(t=>t.id===tab).label}</h1>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Welcome back, Admin. Here's what's happening at GlamSphere.</p>
          </div>
          <button onClick={toCustomer} className="btn-outline text-xs px-3 py-2 rounded-full md:hidden">Exit</button>
        </div>

        {tab === "dashboard" && (
          <div className="fade-in space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={DollarSign} label="Total Revenue (6mo)" value={rupee(totalRevenue)} tone="var(--mint-soft)" sub="+18.4% vs prior period" />
              <StatCard icon={ClipboardList} label="Total Orders" value={totalOrders.toLocaleString("en-IN")} tone="var(--accent-soft)" sub="+9.2% vs prior period" />
              <StatCard icon={Users} label="Active Customers" value={CUSTOMERS.length + "K"} tone="var(--gold-soft)" sub="+4.1% new signups" />
              <StatCard icon={TrendingUp} label="Avg. Order Value" value={rupee(avgOrder)} tone="var(--mint-soft)" />
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="card p-5 lg:col-span-2">
                <div className="font-semibold mb-4">Revenue Trend</div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v)=>`${v/1000}k`} />
                    <Tooltip formatter={(v)=>rupee(v)} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-5">
                <div className="font-semibold mb-4">Sales by Category</div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={CATEGORY_SALES} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {CATEGORY_SALES.map((e,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div className="card fade-in overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid var(--line)" }}>
                {["Product","Category","Price","Stock","Status",""].map(h => <th key={h} className="text-left p-4 font-semibold" style={{ color: "var(--ink-soft)" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {inventory.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4 gs-mono">{rupee(p.price)}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4"><Pill tone={p.stock < 15 ? "accent" : "mint"}>{p.stock < 15 ? "Low stock" : "In stock"}</Pill></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 chip rounded-full px-2 py-1 w-fit">
                        <button onClick={() => setInventory(inv => inv.map(x => x.id===p.id ? {...x, stock: Math.max(0,x.stock-1)} : x))}><Minus size={13}/></button>
                        <button onClick={() => setInventory(inv => inv.map(x => x.id===p.id ? {...x, stock: x.stock+1} : x))}><Plus size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "analytics" && (
          <div className="fade-in space-y-5">
            <div className="card p-5">
              <div className="font-semibold mb-4">Orders per Month</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="var(--mauve)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-5">
                <div className="font-semibold mb-4">Top Categories</div>
                <div className="space-y-3">
                  {CATEGORY_SALES.map((c,i) => (
                    <div key={c.name}>
                      <div className="flex justify-between text-sm mb-1"><span className="font-medium">{c.name}</span><span className="gs-mono">{c.value}%</span></div>
                      <div style={{ height: 8, borderRadius: 99, background: "var(--line)" }}><div style={{ height: 8, borderRadius: 99, width: `${c.value*2.5}%`, background: PIE_COLORS[i] }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <div className="font-semibold mb-4">Best Sellers</div>
                <div className="space-y-3">
                  {[...PRODUCTS].sort((a,b)=>b.reviews-a.reviews).slice(0,5).map((p,i) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span>{i+1}. {p.name}</span><span className="gs-mono" style={{ color: "var(--ink-soft)" }}>{p.reviews} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "customers" && (
          <div className="fade-in">
            <input value={custSearch} onChange={e=>setCustSearch(e.target.value)} placeholder="Search customers..." className="mb-4 px-3 py-2.5 rounded-lg text-sm w-full max-w-sm" style={{ border: "1px solid var(--line)" }} />
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: "1px solid var(--line)" }}>{["ID","Name","Email","Orders","Total Spent","Joined"].map(h => <th key={h} className="text-left p-4 font-semibold" style={{ color: "var(--ink-soft)" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {CUSTOMERS.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase())).map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="p-4 gs-mono">{c.id}</td><td className="p-4 font-semibold">{c.name}</td><td className="p-4" style={{ color: "var(--ink-soft)" }}>{c.email}</td>
                      <td className="p-4">{c.orders}</td><td className="p-4 gs-mono">{rupee(c.spent)}</td><td className="p-4">{c.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="card fade-in overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid var(--line)" }}>{["Order ID","Customer","Items","Total","Status","Date"].map(h => <th key={h} className="text-left p-4 font-semibold" style={{ color: "var(--ink-soft)" }}>{h}</th>)}</tr></thead>
              <tbody>
                {ordersState.map((o,idx) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td className="p-4 gs-mono">{o.id}</td><td className="p-4 font-semibold">{o.customer}</td><td className="p-4">{o.items}</td><td className="p-4 gs-mono">{rupee(o.total)}</td>
                    <td className="p-4">
                      <select value={o.status} onChange={e => setOrdersState(os => os.map((x,i)=>i===idx?{...x,status:e.target.value}:x))} className="chip px-2 py-1 rounded-full text-xs">
                        {["Processing","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "coupons" && (
          <div className="fade-in">
            <button onClick={() => setCoupons(c => [...c, { code: "NEWCODE"+(c.length+1), type: "Percentage", value: 15, uses: 0, active: true, expires: "Dec 31, 2026" }])} className="btn-primary px-4 py-2.5 rounded-full text-sm mb-4 flex items-center gap-1.5"><Plus size={15}/> New coupon</button>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: "1px solid var(--line)" }}>{["Code","Type","Value","Uses","Expires","Active"].map(h => <th key={h} className="text-left p-4 font-semibold" style={{ color: "var(--ink-soft)" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {coupons.map((c,i) => (
                    <tr key={c.code+i} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="p-4 font-bold gs-mono">{c.code}</td><td className="p-4">{c.type}</td>
                      <td className="p-4">{c.type === "Percentage" ? c.value+"%" : rupee(c.value)}</td>
                      <td className="p-4">{c.uses}</td><td className="p-4">{c.expires}</td>
                      <td className="p-4">
                        <button onClick={() => setCoupons(cs => cs.map((x,idx)=>idx===i?{...x,active:!x.active}:x))} className="chip px-2.5 py-1 rounded-full text-xs" style={c.active ? { background: "var(--mint-soft)", color: "var(--mint)", borderColor: "transparent" } : {}}>
                          {c.active ? "Active" : "Paused"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "revenue" && (
          <div className="fade-in space-y-5">
            <div className="card p-5">
              <div className="font-semibold mb-4">Monthly Revenue Report</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v)=>`${v/1000}k`} />
                  <Tooltip formatter={(v)=>rupee(v)} />
                  <Bar dataKey="revenue" fill="var(--accent)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: "1px solid var(--line)" }}>{["Month","Revenue","Orders","Avg. Order Value"].map(h => <th key={h} className="text-left p-4 font-semibold" style={{ color: "var(--ink-soft)" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {REVENUE_DATA.map(r => (
                    <tr key={r.month} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="p-4 font-semibold">{r.month} 2026</td><td className="p-4 gs-mono">{rupee(r.revenue)}</td><td className="p-4">{r.orders}</td><td className="p-4 gs-mono">{rupee(Math.round(r.revenue/r.orders))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== ROOT ============================== */
export default function GlamSphere() {
  const [mode, setMode] = useState("customer");
  return (
    <div className="gs">
      <Theme />
      {mode === "customer" ? <CustomerApp toAdmin={() => setMode("admin")} /> : <AdminApp toCustomer={() => setMode("customer")} />}
    </div>
  );
}
