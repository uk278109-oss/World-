import React from "react";

const liveItems = [
  ["Pakistan Gaming", "1.2K watching", "🎮"],
  ["Trending Sound", "842 watching", "🎵"],
  ["Karachi Events", "486 watching", "📍"],
  ["Gaming Squads", "315 watching", "👥"],
];

export default function NowTrendingScreen({ onBack, onOpenVideo }) {
  return (
    <main className="wd-screen">
      <header className="wd-page-header">
        <button className="wd-back" onClick={onBack}>‹</button>
        <div><b>Now</b><small>Live & trending</small></div>
      </header>

      <div className="wd-filter-row">
        <button className="active">Live</button><button>Pakistan</button><button>Karachi</button>
      </div>

      <h2 className="wd-section-title">What's happening now</h2>
      <section className="wd-list">
        {liveItems.map(([name, watching, icon]) => (
          <button className="wd-live-row" key={name} onClick={() => onOpenVideo?.({ title: name })}>
            <span className="wd-live-icon">{icon}</span>
            <span><strong>{name}</strong><small>🔴 {watching}</small></span>
            <span>›</span>
          </button>
        ))}
      </section>
    </main>
  );
}