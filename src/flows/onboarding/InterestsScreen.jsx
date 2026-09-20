import React, { useState } from "react";

const INTERESTS = [
  "Music", "Gaming", "Technology", "Travel", "Sport",
  "Design", "Business", "Culture", "Food", "Fashion",
  "Film", "Learning"
];

export default function InterestsScreen({ onContinue }) {
  const [selected, setSelected] = useState([]);

  function toggle(item) {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  }

  return (
    <main className="wb-screen wb-selection-screen">
      <section className="wb-form-header">
        <span className="wb-kicker">PERSONALIZE</span>
        <h1>What are you into?</h1>
        <p>Select the things you want WORLD to understand about your interests.</p>
      </section>

      <div className="wb-chip-grid">
        {INTERESTS.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              className={`wb-chip ${active ? "is-active" : ""}`}
              onClick={() => toggle(item)}
              aria-pressed={active}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button className="wb-primary" disabled={selected.length < 3} onClick={() => onContinue(selected)}>
        Continue {selected.length ? `(${selected.length})` : ""}
      </button>
    </main>
  );
}
