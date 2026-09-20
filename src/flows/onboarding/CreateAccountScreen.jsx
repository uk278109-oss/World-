import React, { useState } from "react";

export default function CreateAccountScreen({ onBack, onCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const valid = name.trim() && email.trim() && password.length >= 8;

  function submit(event) {
    event.preventDefault();
    if (!valid) return;
    onCreated({ name: name.trim(), email: email.trim() });
  }

  return (
    <main className="wb-screen wb-form-screen">
      <button className="wb-back" onClick={onBack} aria-label="Back">←</button>

      <section className="wb-form-header">
        <span className="wb-kicker">CREATE ACCOUNT</span>
        <h1>Start your WORLD.</h1>
        <p>Your account details stay private and are stored through the configured backend.</p>
      </section>

      <form className="wb-form" onSubmit={submit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </label>

        <p className="wb-hint">Password must contain at least 8 characters.</p>

        <button className="wb-primary" disabled={!valid}>Continue</button>
      </form>
    </main>
  );
}
