import React, { useState } from "react";
import HomeFeedScreen from "./HomeFeedScreen";
import NowTrendingScreen from "./NowTrendingScreen";
import SearchScreen from "./SearchScreen";
import SearchResultsScreen from "./SearchResultsScreen";
import VideoPlayerScreen from "./VideoPlayerScreen";
import VideoDiscussionScreen from "./VideoDiscussionScreen";
import VideoAIToolsScreen from "./VideoAIToolsScreen";
import CreateScreen from "./CreateScreen";

export default function DiscoveryFlow() {
  const [screen, setScreen] = useState("home");
  const [video, setVideo] = useState(null);
  const [query, setQuery] = useState("");

  const openVideo = (item) => { setVideo(item); setScreen("player"); };

  if (screen === "home") return <HomeFeedScreen onOpenVideo={openVideo} onNow={() => setScreen("now")} onSearch={() => setScreen("search")} onCreate={() => setScreen("create")} />;
  if (screen === "now") return <NowTrendingScreen onBack={() => setScreen("home")} onOpenVideo={openVideo} />;
  if (screen === "search") return <SearchScreen onBack={() => setScreen("home")} onSearch={(q) => { setQuery(q); setScreen("results"); }} />;
  if (screen === "results") return <SearchResultsScreen query={query} onBack={() => setScreen("search")} onOpenVideo={openVideo} />;
  if (screen === "player") return <VideoPlayerScreen video={video} onBack={() => setScreen("home")} onDiscussion={() => setScreen("discussion")} onAITools={() => setScreen("ai-tools")} />;
  if (screen === "discussion") return <VideoDiscussionScreen onBack={() => setScreen("player")} />;
  if (screen === "ai-tools") return <VideoAIToolsScreen onBack={() => setScreen("player")} onCreate={() => setScreen("create")} />;
  return <CreateScreen onBack={() => setScreen("home")} />;
}