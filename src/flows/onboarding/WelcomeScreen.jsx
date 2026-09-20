import React from "react";

export default function WelcomeScreen({ onCreate, onLogin }) {
  return (
    <main className="wb-screen wb-welcome">
      <div className="wb-top-label">WORLD</div>

      <section className="wb-hero">
        <div className="wb-orbit wb-orbit-one" />
        <div className="wb-orbit wb-orbit-two" />
        <div className="wb-hero-core">W</div>
      </section>

      <section className="wb-copy">
        <span className="wb-kicker">WELCOME</span>
        <h1>Be where it happens.</h1>
        <p>Discover your world and shape what comes next.</p>
      </section>

      <div className="wb-actions">
        <button className="wb-primary" onClick={onCreate}>Create account</button>
        <button className="wb-secondary" onClick={onLogin}>Welcome back</button>
      </div>
    </main>
  );
}
