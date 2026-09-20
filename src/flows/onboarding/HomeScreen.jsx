import React from "react";

export default function HomeScreen({ profile }) {
  return (
    <main className="wb-screen wb-home">
      <header className="wb-home-header">
        <div>
          <span className="wb-kicker">WORLD</span>
          <h1>Home</h1>
        </div>
        <div className="wb-avatar" aria-hidden="true">
          {(profile?.name || "W").slice(0, 1).toUpperCase()}
        </div>
      </header>

      <section className="wb-empty-state">
        <div className="wb-empty-icon">✦</div>
        <h2>Your WORLD starts here.</h2>
        <p>
          Real content will appear here when your connected WORLD data is available.
          No artificial posts or fake activity are inserted by this flow.
        </p>
      </section>

      <nav className="wb-bottom-nav" aria-label="Primary">
        <button className="is-active">Home</button>
        <button>Search</button>
        <button>Create</button>
        <button>Inbox</button>
        <button>Profile</button>
      </nav>
    </main>
  );
}
