import React, { useState } from "react";

const FEEDS = [
  { id: "nearby", title: "Around you", text: "Discover what is happening nearby." },
  { id: "global", title: "Around the world", text: "See what people are sharing globally." },
  { id: "creators", title: "Creators", text: "Keep up with creators and communities you choose." }
];

export default function FeedSelectionScreen({ onContinue }) {
  const [selected, setSelected] = useState(["nearby"]);

  function toggle(id) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  return (
    <main className="wb-screen wb-selection-screen">
      <section className="wb-form-header">
        <span className="wb-kicker">YOUR FEED</span>
        <h1>Choose your starting view.</h1>
        <p>You can change these preferences later.</p>
      </section>

      <div className="wb-option-list">
        {FEEDS.map((feed) => {
          const active = selected.includes(feed.id);
          return (
            <button
              key={feed.id}
              className={`wb-option ${active ? "is-active" : ""}`}
              onClick={() => toggle(feed.id)}
              aria-pressed={active}
            >
              <span className="wb-option-dot">{active ? "✓" : ""}</span>
              <span>
                <strong>{feed.title}</strong>
                <small>{feed.text}</small>
              </span>
            </button>
          );
        })}
      </div>

      <button className="wb-primary" disabled={!selected.length} onClick={() => onContinue(selected)}>
        Enter WORLD
      </button>
    </main>
  );
}
