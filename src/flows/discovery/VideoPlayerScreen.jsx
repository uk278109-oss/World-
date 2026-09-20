import React from "react";

export default function VideoPlayerScreen({ video, onBack, onDiscussion, onAITools }) {
  return (
    <main className="wd-screen wd-player">
      <header className="wd-player-top">
        <button className="wd-back" onClick={onBack}>×</button>
        <span>WORLD</span>
        <button className="wd-icon">⋮</button>
      </header>

      <div className="wd-player-art">▶</div>

      <section className="wd-player-info">
        <h1>{video?.title || "WORLD Video"}</h1>
        <p>@worldcreator · 12.5K views</p>
        <div className="wd-player-actions">
          <button>♡ Like</button>
          <button onClick={onDiscussion}>▢ Comment</button>
          <button>↗ Share</button>
          <button>⌑ Save</button>
        </div>
        <button className="wd-primary" onClick={onAITools}>AI Tools</button>
      </section>
    </main>
  );
}