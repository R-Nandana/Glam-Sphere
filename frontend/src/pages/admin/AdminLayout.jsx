import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/orders", label: "Order Tracking" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/revenue", label: "Revenue Reports" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-[80vh]">
      <aside className="w-56 border-r border-[#EFE1E0] p-4 hidden md:block">
        <div className="space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `block px-3 py-2 rounded-xl text-sm font-semibold ${isActive ? "bg-ink text-white" : "text-[#6B5760] hover:bg-[#F3ECEB]"}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
