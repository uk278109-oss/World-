import React, { useState } from "react";

export default function LoginScreen({ onBack, onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const valid = email.trim() && password.length >= 8;

  function submit(event) {
    event.preventDefault();
    if (!valid) return;
    onLoggedIn({ email: email.trim() });
  }

  return (
    <main className="wb-screen wb-form-screen">
      <button className="wb-back" onClick={onBack} aria-label="Back">←</button>

      <section className="wb-form-header">
        <span className="wb-kicker">WELCOME BACK</span>
        <h1>Good to see you.</h1>
        <p>Sign in to continue to your WORLD.</p>
      </section>

      <form className="wb-form" onSubmit={submit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>

        <button className="wb-primary" disabled={!valid}>Sign in</button>
      </form>
    </main>
  );
}
