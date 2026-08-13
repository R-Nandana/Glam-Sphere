import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";
import { ToastProvider } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SkeletonGrid } from "./components/SkeletonCard";

// Eagerly-loaded customer routes (above-the-fold)
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SkinQuiz from "./pages/SkinQuiz";
import ShadeFinder from "./pages/ShadeFinder";
import NotFound from "./pages/NotFound";

// Lazy-load admin bundle — code-split for performance
const AdminLayout    = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminOrders    = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCoupons   = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminRevenue   = lazy(() => import("./pages/admin/AdminRevenue"));

function AdminFallback() {
  return (
    <div style={{ padding: "2rem" }}>
      <div className="skeleton" style={{ height: "40px", width: "200px", marginBottom: "1.5rem", borderRadius: "8px" }} />
      <SkeletonGrid count={4} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quiz" element={<SkinQuiz />} />
              <Route path="/shade-finder" element={<ShadeFinder />} />

              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Suspense fallback={<AdminFallback />}>
                      <AdminLayout />
                    </Suspense>
                  </RequireAdmin>
                }
              >
                <Route index element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
                <Route path="inventory" element={<Suspense fallback={<AdminFallback />}><AdminInventory /></Suspense>} />
                <Route path="orders" element={<Suspense fallback={<AdminFallback />}><AdminOrders /></Suspense>} />
                <Route path="customers" element={<Suspense fallback={<AdminFallback />}><AdminCustomers /></Suspense>} />
                <Route path="coupons" element={<Suspense fallback={<AdminFallback />}><AdminCoupons /></Suspense>} />
                <Route path="revenue" element={<Suspense fallback={<AdminFallback />}><AdminRevenue /></Suspense>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
