import React, { useState } from "react";

export default function VideoEditorScreen({ onBack, onNext }) {
  const [selected, setSelected] = useState("Gallery");

  return (
    <main className="wc-screen wc-editor">
      <header className="wc-header">
        <button className="wc-back" onClick={onBack}>×</button>
        <b>Video Editor</b>
        <button className="wc-text-btn" onClick={onNext}>Next</button>
      </header>

      <section className="wc-preview">
        <div className="wc-preview-person">◉</div>
        <span>Preview</span>
      </section>

      <div className="wc-editor-strip">
        {["Gallery", "Templates", "Trending"].map((item) => (
          <button className={selected === item ? "active" : ""} onClick={() => setSelected(item)} key={item}>
            {item}
          </button>
        ))}
      </div>

      <div className="wc-editor-tools">
        {["Trim", "Music", "Text", "Filters", "Effects", "Speed"].map((tool) => (
          <button key={tool}><span>◇</span>{tool}</button>
        ))}
      </div>
    </main>
  );
}