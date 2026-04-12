import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';

const KNOWLEDGE = {
  greet: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste'],
  valuation: ['valuation', 'price', 'value', 'estimate', 'worth', 'cost', 'sqft', 'rate'],
  risk: ['risk', 'safe', 'danger', 'score', 'level', 'low', 'medium', 'high', 'critical'],
  fraud: ['fraud', 'fake', 'scam', 'cheat', 'suspicious', 'anomaly', 'detect'],
  forecast: ['forecast', 'future', 'predict', '5 year', 'growth', 'appreciation', 'trend'],
  localities: ['whitefield', 'koramangala', 'indiranagar', 'hsr', 'btm', 'jp nagar', 'hebbal', 'sarjapur', 'electronic city', 'marathahalli', 'locality', 'area', 'location'],
  models: ['model', 'ai', 'ml', 'machine learning', 'random forest', 'xgboost', 'ann', 'neural', 'algorithm'],
  report: ['report', 'pdf', 'download', 'csv', 'export'],
  howto: ['how', 'use', 'start', 'begin', 'run', 'analyze', 'analysis'],
  recommendation: ['buy', 'sell', 'hold', 'avoid', 'invest', 'recommendation', 'decision'],
  shap: ['shap', 'explain', 'explainable', 'xai', 'feature', 'importance', 'why'],
  bangalore: ['bangalore', 'bengaluru', 'karnataka', 'city'],
};

const RESPONSES = {
  greet: [
    "Namaste! 🙏 Welcome to LandIQ — your AI-powered land intelligence platform for Bangalore. How can I assist you today?",
    "Hello! I'm LandIQ's AI assistant. I can help you with property valuation, risk analysis, fraud detection, and investment recommendations. What would you like to know?",
  ],
  valuation: [
    "LandIQ uses a **3-model ensemble** for valuation:\n\n• **Random Forest** (35% weight) — R² = 0.8947\n• **XGBoost** (45% weight) — R² = 0.8921\n• **ANN Neural Network** (20% weight) — R² = 0.8985\n\nFinal ensemble accuracy: **R² = 0.8990** trained on 8,000 Bangalore records.",
    "Our AI valuation covers all 60 Bangalore localities. Price range in our dataset: ₹583 – ₹35,073/sqft. Premium areas like MG Road average ₹26,611/sqft while peripheral areas like Hoskote average ₹2,800/sqft.",
  ],
  risk: [
    "LandIQ's risk analysis uses a **GradientBoosting Classifier** (73.6% accuracy) that predicts:\n\n🟢 LOW — Safe investment\n🟡 MEDIUM — Proceed with caution\n🔴 HIGH — Significant risks present\n⛔ CRITICAL — Avoid this property\n\nRisk is scored across 6 categories: Price Anomaly, Ownership, Legal, Environmental, Infrastructure, and Market.",
    "Risk scores are calculated from 6 weighted factors. Legal disputes add 85 points, flood zones add 55 points, and rapid ownership changes increase the ownership risk score significantly.",
  ],
  fraud: [
    "LandIQ detects fraud using **IsolationForest** (ML anomaly detection) + 5 rule-based signals:\n\n1. Extreme underpricing (>50% below market)\n2. Rapid ownership churn (3+ changes in 3 years)\n3. Sale during legal dispute\n4. Below Bangalore market floor price\n5. Quick flip inflation\n\nFraud probability is combined: 60% rule-based + 40% ML anomaly score.",
    "Flood-prone areas like Bellandur, Varthur, and Marathahalli have higher environmental risk scores due to lake proximity. Always check the flood zone indicator before investing.",
  ],
  forecast: [
    "LandIQ provides **5-year price forecasts** using locality-specific growth rates:\n\n🏆 Highest growth: Devanahalli (16%) — Airport corridor\n📈 IT Corridor: Whitefield, Sarjapur Road (14-15%)\n🏙️ Premium: Indiranagar, Koramangala (11%)\n🌿 Peripheral: Hoskote, Anekal (9-10%)\n\nForecasts adjust for zone type and infrastructure quality.",
    "The 5-year forecast multiplies current price by compound growth: Price × (1 + rate)^years. Commercial zones get 12% modifier, industrial 5%, agricultural -12%.",
  ],
  localities: [
    "LandIQ covers **60 Bangalore localities** across all zones:\n\n🏙️ **Premium Central**: MG Road (₹22K), Koramangala (₹18K), Indiranagar (₹12K)\n💻 **IT Corridor**: Whitefield (₹8.5K), Marathahalli (₹9K), ITPL (₹10K)\n🌿 **South**: Jayanagar (₹11K), HSR Layout (₹10.5K), JP Nagar (₹9.5K)\n✈️ **North**: Hebbal (₹9.5K), Devanahalli (₹3.2K)\n\nAll prices in ₹/sqft (2024 market data).",
    "Whitefield and Sarjapur Road are top picks for IT professionals. Devanahalli is booming due to airport expansion. Bellandur and Varthur have flood risk from lake overflow — check carefully!",
  ],
  models: [
    "LandIQ uses **6 AI models**:\n\n1. 🌲 Random Forest (150 trees) — Valuation\n2. ⚡ XGBoost (300 estimators) — Valuation\n3. 🧠 ANN MLPRegressor (128→64→32) — Valuation\n4. 📊 GradientBoosting Classifier — Risk Level\n5. 🔍 IsolationForest (200 trees) — Fraud Detection\n6. 📈 SHAP — Explainable AI\n\nAll trained on 8,000 Bangalore records with 18 features.",
    "The ensemble combines RF + XGBoost + ANN with weights 35/45/20. This outperforms any single model, achieving MAE of ₹1,016/sqft on test data.",
  ],
  report: [
    "LandIQ generates two types of reports:\n\n📄 **PDF Report** — Full analysis with all 6 model outputs, SHAP values, risk breakdown, fraud signals, and 5-year forecast table.\n\n📊 **CSV Export** — Structured data for Excel analysis including all metrics.\n\nBoth are available after running an analysis. Click 'PDF Report' or 'Export CSV' buttons.",
  ],
  howto: [
    "Getting started with LandIQ is easy:\n\n1️⃣ **Register** — Create free account\n2️⃣ **Add Parcel** — Enter property details\n3️⃣ **Run Analysis** — Click 'Run AI Analysis'\n4️⃣ **Get Results** — Valuation, risk, fraud, forecast\n5️⃣ **Download Report** — PDF or CSV\n\nOr use **Quick Analysis** (no login needed) at the Analysis page!",
    "You can also use the **Bangalore Market Map** to explore 60 localities with growth rates, risk zones, and average prices before deciding where to invest.",
  ],
  recommendation: [
    "LandIQ gives **Buy / Hold / Avoid** recommendations based on:\n\n✅ **BUY** — Low risk, fair/below market price, no fraud signals\n⏸️ **HOLD** — Overpriced (>20% above estimate) or moderate risk\n❌ **AVOID** — Fraud detected, critical risk, or extreme overpricing\n\nThe recommendation also includes an **Investment Score (0-100)** for easy comparison.",
  ],
  shap: [
    "**SHAP (SHapley Additive exPlanations)** is our Explainable AI layer.\n\nIt shows which features contributed most to the valuation:\n• area_sqft — typically 30-40% contribution\n• distance_city_center — 15-25%\n• near_tech_park — 10-15%\n• infrastructure quality — 8-12%\n\nThis makes AI decisions transparent and understandable.",
  ],
  bangalore: [
    "LandIQ is specialized for **Bangalore (Bengaluru)** real estate:\n\n📍 60 localities covered\n💰 Price range: ₹583 – ₹35,073/sqft\n📈 Avg growth: 8-16% annually\n🏗️ Zones: Residential, Commercial, Agricultural, Industrial\n\nFrom premium MG Road to emerging Devanahalli — we cover all of Bangalore!",
  ],
  default: [
    "I can help you with:\n\n• 💰 Property valuation & pricing\n• ⚠️ Risk analysis & scoring\n• 🔍 Fraud detection\n• 📈 5-year price forecast\n• 🗺️ Bangalore locality insights\n• 🤖 AI model explanations\n• 📄 Report generation\n\nWhat would you like to know?",
    "Great question! LandIQ covers all aspects of Bangalore land intelligence. Try asking about specific localities, risk scores, fraud detection, or how to run an analysis.",
  ],
};

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const [key, keywords] of Object.entries(KNOWLEDGE)) {
    if (keywords.some(k => lower.includes(k))) {
      const responses = RESPONSES[key] || RESPONSES.default;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
}

const QUICK_QUESTIONS = [
  'How does valuation work?',
  'Top localities in Bangalore?',
  'How to detect fraud?',
  'What is risk score?',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! 🙏 I'm LandIQ's AI assistant. Ask me anything about Bangalore land valuation, risk analysis, fraud detection, or investment recommendations!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(msg) }]);
    }, 800 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* FAB Button */}
      <button className="chatbot-fab" onClick={() => setOpen(o => !o)} title="Ask LandIQ AI">
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">AI</div>
              <div>
                <div className="chatbot-name">LandIQ Assistant</div>
                <div className="chatbot-status">
                  <span className="gold-dot" style={{ width: 6, height: 6 }} />
                  Online — Bangalore Real Estate Expert
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0.2rem' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.text.split('\n').map((line, j) => (
                  <React.Fragment key={j}>
                    {line.split(/\*\*(.*?)\*\*/g).map((part, k) =>
                      k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                    )}
                    {j < m.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
            {typing && (
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0.5rem 0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--border)', background: 'var(--light)' }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: 12, border: '1px solid var(--gold)', background: 'var(--gold-pale)', color: 'var(--gold-dark)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold-pale)'; e.currentTarget.style.color = 'var(--gold-dark)'; }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about Bangalore land..."
            />
            <button className="chatbot-send" onClick={() => send()} disabled={!input.trim()}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
