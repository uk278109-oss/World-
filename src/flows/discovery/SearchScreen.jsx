import React, { useState } from "react";

export default function SearchScreen({ onBack, onSearch }) {
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch?.(query.trim());
  };

  return (
    <main className="wd-screen">
      <header className="wd-page-header">
        <button className="wd-back" onClick={onBack}>‹</button>
        <b>Search WORLD</b>
      </header>

      <form className="wd-search" onSubmit={submit}>
        <span>⌕</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search WORLD..." autoFocus />
      </form>

      <h2 className="wd-section-title">Trending Searches</h2>
      <div className="wd-search-list">
        {["gaming phone", "karachi food", "viral dance", "ai tools"].map((item) => (
          <button key={item} onClick={() => onSearch?.(item)}>⌕ <span>{item}</span> ›</button>
        ))}
      </div>

      <h2 className="wd-section-title">Recent Searches</h2>
      <div className="wd-search-list">
        {["gaming", "education"].map((item) => (
          <button key={item} onClick={() => onSearch?.(item)}>◷ <span>{item}</span> ›</button>
        ))}
      </div>
    </main>
  );
}