import React, { useState } from "react";

export default function PostScreen({ onBack, onPublish }) {
  const [audience, setAudience] = useState("Everyone");

  return (
    <main className="wc-screen">
      <header className="wc-header">
        <button className="wc-back" onClick={onBack}>‹</button>
        <b>Post</b>
      </header>

      <section className="wc-post-preview">
        <div className="wc-post-image">WORLD</div>
        <h2>Your creation</h2>
        <p>Add a caption and choose who can see it.</p>
      </section>

      <div className="wc-post-options">
        {["Everyone", "Friends", "Private"].map((item) => (
          <button className={audience === item ? "active" : ""} onClick={() => setAudience(item)} key={item}>
            <span>{audience === item ? "●" : "○"}</span>{item}
          </button>
        ))}
      </div>

      <button className="wc-primary" onClick={onPublish}>Publish</button>
    </main>
  );
}