import React from "react";

const createOptions = [
  ["✦", "Create with AI"],
  ["▶", "Video"],
  ["▣", "Photo"],
  ["▤", "Post"],
  ["◎", "Story"],
  ["●", "Live"],
  ["♪", "Audio"],
  ["◉", "Event"],
  ["♧", "Squad Feed"],
];

export default function CreateScreen({ onBack, onSelect }) {
  return (
    <main className="wd-screen">
      <header className="wd-page-header">
        <button className="wd-back" onClick={onBack}>‹</button>
        <b>Create</b>
      </header>

      <button className="wd-ai-create" onClick={() => onSelect?.("ai")}>
        <span>✦</span><strong>Create with AI</strong><small>Turn your idea into a creation</small>
      </button>

      <section className="wd-create-grid">
        {createOptions.slice(1).map(([icon, name]) => (
          <button key={name} onClick={() => onSelect?.(name)} className="wd-create-option">
            <span>{icon}</span><strong>{name}</strong>
          </button>
        ))}
      </section>
    </main>
  );
}