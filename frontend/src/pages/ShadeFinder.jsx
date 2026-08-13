import React, { useState } from "react";
import api from "../api/axios";

const DEPTHS = ["#F7E1C8", "#EBC199", "#D9A06B", "#B67848", "#8A5233", "#5C3421"];

export default function ShadeFinder() {
  const [undertone, setUndertone] = useState(null);
  const [depth, setDepth] = useState(2);
  const [match, setMatch] = useState(null);

  const find = async (u, d) => {
    if (!u) return;
    const { data } = await api.post("/ai/shade-finder", { undertone: u, depth: d });
    setMatch(data.match);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Find your exact match</h2>

      <div className="mb-6">
        <div className="font-semibold mb-3">1. Pick your undertone</div>
        <div className="flex gap-3">
          {["Cool", "Neutral", "Warm"].map((u) => (
            <button key={u} onClick={() => { setUndertone(u); find(u, depth); }} className={`chip px-4 py-2 ${undertone === u ? "active" : ""}`}>{u}</button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="font-semibold mb-3">2. Match your depth</div>
        <input type="range" min={0} max={5} value={depth} onChange={(e) => { const d = Number(e.target.value); setDepth(d); find(undertone, d); }} className="w-full" />
        <div className="flex justify-between mt-3">
          {DEPTHS.map((d, i) => (
            <span key={i} className="w-6 h-6 rounded-full" style={{ background: d, outline: i === depth ? "2px solid #2A1B22" : "none", outlineOffset: 2 }} />
          ))}
        </div>
      </div>

      {match && (
        <div className="card p-5 flex gap-4 items-center">
          <span className="w-12 h-12 rounded-full" style={{ background: match.shade.hex }} />
          <div className="flex-1">
            <div className="text-xs font-bold text-mint">MATCH FOUND</div>
            <div className="font-bold">{match.productName}</div>
            <div className="text-sm text-[#6B5760]">Shade: {match.shade.name}</div>
          </div>
          <div className="font-bold">{match.confidence}% match</div>
        </div>
      )}
    </div>
  );
}
