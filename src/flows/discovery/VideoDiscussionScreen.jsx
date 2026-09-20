import React from "react";

const comments = [
  ["@worldcreator", "Karachi is love ❤️"],
  ["@thecreator", "Best place in Pakistan!"],
  ["@travel_boy", "Which place is this?"],
  ["@gaminggirl", "This looks amazing!"],
];

export default function VideoDiscussionScreen({ onBack }) {
  return (
    <main className="wd-screen">
      <header className="wd-page-header">
        <button className="wd-back" onClick={onBack}>‹</button>
        <div><b>Comments</b><small>1.2K</small></div>
      </header>

      <div className="wd-filter-row"><button className="active">Top</button><button>Community</button><button>Creators</button><button>Polls</button></div>

      <section className="wd-comments">
        {comments.map(([user, text]) => (
          <article className="wd-comment" key={user}>
            <div className="wd-avatar">{user[1]?.toUpperCase() || "W"}</div>
            <div><strong>{user}</strong><p>{text}</p></div>
          </article>
        ))}
      </section>

      <form className="wd-comment-box" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Add a comment..." />
        <button>➤</button>
      </form>
    </main>
  );
}