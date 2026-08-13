import React, { useState } from "react";
import api from "../api/axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, I'm Glow — your AI beauty advisor. Ask me about skincare, routines, or shade matching." },
  ]);
  const [input, setInput] = useState("");

  const send = async (text) => {
    const t = text ?? input;
    if (!t.trim()) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    const { data } = await api.post("/ai/chat", { message: t });
    setMessages((m) => [...m, { from: "bot", text: data.reply }]);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary fixed bottom-6 right-6 px-5 py-3 shadow-lg">
        Ask Glow
      </button>
    );
  }

  return (
    <div className="card fixed bottom-6 right-6 w-80 h-96 flex flex-col shadow-xl">
      <div className="flex items-center justify-between p-3 border-b border-[#EFE1E0]">
        <span className="font-bold text-sm">Glow — Beauty AI</span>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm px-3 py-2 rounded-2xl max-w-[85%] ${m.from === "bot" ? "bg-[#F3ECEB]" : "bg-accent text-white ml-auto"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-2 border-t border-[#EFE1E0]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about skincare..."
          className="flex-1 text-sm px-3 py-2 rounded-full border border-[#EFE1E0]"
        />
        <button onClick={() => send()} className="btn-primary px-3 py-2 text-sm">Send</button>
      </div>
    </div>
  );
}
