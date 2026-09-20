import React from "react";

export default function AIEditScreen({ onBack, onNext }) {
  const tools = [
    ["✦", "Auto edit", "Create a polished edit automatically"],
    ["♪", "Add music", "Match music to your video"],
    ["T", "Smart captions", "Generate captions automatically"],
    ["◈", "Enhance", "Improve your video"],
    ["✂", "Smart clips", "Find strong moments"],
  ];

  return (
    <main className="wc-screen">
      <header className="wc-header">
        <button className="wc-back" onClick={onBack}>‹</button>
        <div><b>AI Edit</b><small>AI-powered editing</small></div>
      </header>

      <div className="wc-ai-preview">✦</div>
      <h2>AI Edit</h2>
      <p className="wc-muted">Let AI help you turn your content into a finished creation.</p>

      <section className="wc-ai-list">
        {tools.map(([icon, name, desc]) => (
          <button key={name}>
            <span className="wc-tool-icon">{icon}</span>
            <span><strong>{name}</strong><small>{desc}</small></span>
          </button>
        ))}
      </section>

      <button className="wc-primary" onClick={onNext}>Create Edit</button>
    </main>
  );
}