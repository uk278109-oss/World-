import React from "react";

const videos = [
  { title: "Night vibes in the city", creator: "@worldcreator", views: "12.5K", image: "🌃" },
  { title: "Pakistan's hidden places", creator: "@travelworld", views: "8.9K", image: "🏔️" },
  { title: "Gaming setup tour", creator: "@gamingworld", views: "6.2K", image: "🎮" },
];

export default function HomeFeedScreen({ onOpenVideo, onNow, onSearch, onCreate }) {
  return (
    <main className="wd-screen wd-home">
      <header className="wd-header">
        <div>
          <div className="wd-brand">WORLD</div>
          <div className="wd-tabs"><button className="active">For You</button><button>Following</button></div>
        </div>
        <button className="wd-icon" onClick={onSearch}>⌕</button>
      </header>

      <section className="wd-feed">
        {videos.map((video, i) => (
          <article className="wd-video-card" key={video.title} onClick={() => onOpenVideo?.(video)}>
            <div className={`wd-video-art art-${i}`}>{video.image}</div>
            <div className="wd-video-info">
              <div>
                <strong>{video.title}</strong>
                <span>{video.creator} · {video.views} views</span>
              </div>
              <div className="wd-actions">♡  ♧  ↗</div>
            </div>
          </article>
        ))}
      </section>

      <nav className="wd-nav">
        <button className="active">⌂<span>Home</span></button>
        <button onClick={onNow}>⌁<span>Now</span></button>
        <button onClick={onCreate}>⊞<span>Create</span></button>
        <button>♧<span>Squads</span></button>
        <button>♙<span>Inbox</span></button>
        <button>♙<span>Me</span></button>
      </nav>
    </main>
  );
}