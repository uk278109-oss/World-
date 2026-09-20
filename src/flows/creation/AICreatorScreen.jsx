import React, { useState } from "react";

export default function AICreatorScreen({ onBack, onPublish }) {
  const [prompt, setPrompt] = useState("");

  return (
    <main className="wc-screen">
      <header className="wc-header">
        <button className="wc-back" onClick={onBack}>‹</button>
        <div><b>AI Creator</b><small>Turn your idea into content</small></div>
      </header>

      <textarea
        className="wc-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What do you want to create?"
      />

      <div className="wc-ai-options">
        {["Everyone", "Fast", "Translate", "Music", "Generate"].map((item) => (
          <button key={item}>{item}</button>
        ))}
      </div>

      <button className="wc-primary" disabled={!prompt.trim()} onClick={onPublish}>
        Generate
      </button>
    </main>
  );
}