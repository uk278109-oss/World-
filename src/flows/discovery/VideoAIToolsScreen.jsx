import React from "react";

const tools = [
  ["✦", "Ask WORLD about this video"],
  ["◈", "AI Edit"],
  ["≋", "Translate"],
  ["♪", "Add music"],
  ["◉", "Create clips"],
  ["✦", "Ask AI a question"],
];

export default function VideoAIToolsScreen({ onBack, onCreate }) {
  return (
    <main className="wd-screen">
      <header className="wd-page-header">
        <button className="wd-back" onClick={onBack}>‹</button>
        <div><b>Video AI Tools</b><small>AI-powered tools</small></div>
      </header>

      <section className="wd-ai-tools">
        {tools.map(([icon, name]) => (
          <button key={name} className="wd-ai-tool" onClick={name === "AI Edit" ? onCreate : undefined}>
            <span>{icon}</span><strong>{name}</strong><small>Explore</small>
          </button>
        ))}
      </section>
    </main>
  );
}