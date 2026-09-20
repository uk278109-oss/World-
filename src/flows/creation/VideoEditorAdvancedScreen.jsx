import React from "react";

export default function VideoEditorAdvancedScreen({ onBack, onNext }) {
  const tools = ["Crop", "Adjust", "Caption", "Subtitles", "Remove", "Reframe"];

  return (
    <main className="wc-screen wc-editor">
      <header className="wc-header">
        <button className="wc-back" onClick={onBack}>‹</button>
        <b>Video Editor</b>
        <button className="wc-text-btn" onClick={onNext}>Next</button>
      </header>

      <section className="wc-advanced-preview">
        <div>Video Preview</div>
      </section>

      <div className="wc-timeline">
        <span>00:00</span><div className="wc-track"><i /></div><span>00:15</span>
      </div>

      <div className="wc-editor-tools">
        {tools.map((tool) => <button key={tool}><span>◇</span>{tool}</button>)}
      </div>
    </main>
  );
}