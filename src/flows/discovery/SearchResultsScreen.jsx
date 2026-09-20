import React from "react";

const results = [
  ["Pakistan Gaming", "Gaming", "🎮", "12K followers"],
  ["Gaming Phone", "Products", "📱", "8.2K followers"],
  ["World Travel", "Creators", "🌍", "6.4K followers"],
];

export default function SearchResultsScreen({ query, onBack, onOpenVideo }) {
  return (
    <main className="wd-screen">
      <header className="wd-page-header">
        <button className="wd-back" onClick={onBack}>‹</button>
        <div><b>Search Results</b><small>{query}</small></div>
      </header>

      <div className="wd-filter-row">
        <button className="active">All</button><button>Videos</button><button>People</button><button>Squads</button>
      </div>

      <section className="wd-results">
        {results.map(([name, type, icon, meta]) => (
          <button className="wd-result-card" key={name} onClick={() => onOpenVideo?.({ title: name })}>
            <span className="wd-result-art">{icon}</span>
            <span><strong>{name}</strong><small>{type} · {meta}</small></span>
            <span>›</span>
          </button>
        ))}
      </section>
    </main>
  );
}