import React from "react";

export default function CreateCreationScreen({ onBack, onEditor }) {
  const items = [
    ["▶", "Video"],
    ["▣", "Photo"],
    ["▤", "Post"],
    ["◎", "Story"],
    ["●", "Live"],
    ["♪", "Audio"],
    ["◉", "Event"],
    ["♧", "Squad Feed"],
  ];

  return (
    <main className="wc-screen">
      <header className="wc-header">
        <button className="wc-back" onClick={onBack}>‹</button>
        <b>Create</b>
      </header>

      <button className="wc-ai-banner" onClick={onEditor}>
        <span>✦</span>
        <strong>Create with AI</strong>
      </button>

      <div className="wc-create-grid">
        {items.map(([icon, name]) => (
          <button key={name} onClick={name === "Video" ? onEditor : undefined}>
            <span>{icon}</span>
            <strong>{name}</strong>
          </button>
        ))}
      </div>
    </main>
  );
}