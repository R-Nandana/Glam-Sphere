import React, { useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const QUESTIONS = [
  { key: "feel", q: "How does your skin feel by midday?", options: ["Shiny & greasy", "Tight & flaky", "Oily T-zone, dry cheeks", "Comfortable & balanced"] },
  { key: "pores", q: "How visible are your pores?", options: ["Large, especially T-zone", "Barely visible", "Visible only in T-zone", "Small and even"] },
  { key: "sensitivity", q: "Does your skin react easily to new products?", options: ["Rarely", "Sometimes", "Often — redness or itching", "Never tried much"] },
  { key: "goal", q: "What's your top skin goal right now?", options: ["Control oil & shine", "Deep hydration", "Even out texture", "Overall maintenance"] },
];

export default function SkinQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [recs, setRecs] = useState([]);

  const answer = async (opt) => {
    const next = { ...answers, [QUESTIONS[step].key]: opt };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const { data } = await api.post("/ai/skin-quiz", { answers: next });
      setResult(data.skinType);
      setRecs(data.recommendations);
    }
  };

  if (result) {
    return (
      <div className="max-w-[1000px] mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold">Your skin type: {result}</h2>
        <p className="text-[#6B5760] mt-2">Here are picks suited to your profile.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {recs.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="text-xs font-bold text-accent">SKIN TYPE QUIZ · {step + 1} OF {QUESTIONS.length}</div>
      <h2 className="text-2xl font-bold mt-3 mb-6">{q.q}</h2>
      <div className="space-y-3">
        {q.options.map((opt) => (
          <button key={opt} onClick={() => answer(opt)} className="card w-full text-left p-4 hover:border-accent">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
