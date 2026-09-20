import React from "react";

export default function PublishScreen({ onDone }) {
  return (
    <main className="wc-screen wc-published">
      <section>
        <div className="wc-success">✓</div>
        <h1>Your post is live!</h1>
        <p>Your creation has been published to WORLD.</p>
        <button className="wc-primary" onClick={onDone}>View Post</button>
      </section>
    </main>
  );
}