import React, { useState } from "react";
import CreateCreationScreen from "./CreateCreationScreen";
import VideoEditorScreen from "./VideoEditorScreen";
import AIEditScreen from "./AIEditScreen";
import VideoEditorAdvancedScreen from "./VideoEditorAdvancedScreen";
import AICreatorScreen from "./AICreatorScreen";
import PostScreen from "./PostScreen";
import PublishScreen from "./PublishScreen";

export default function CreationFlow({ onExit }) {
  const [screen, setScreen] = useState("create");

  if (screen === "create") return <CreateCreationScreen onBack={onExit} onEditor={() => setScreen("editor")} />;
  if (screen === "editor") return <VideoEditorScreen onBack={() => setScreen("create")} onNext={() => setScreen("ai-edit")} />;
  if (screen === "ai-edit") return <AIEditScreen onBack={() => setScreen("editor")} onNext={() => setScreen("advanced-editor")} />;
  if (screen === "advanced-editor") return <VideoEditorAdvancedScreen onBack={() => setScreen("ai-edit")} onNext={() => setScreen("ai-creator")} />;
  if (screen === "ai-creator") return <AICreatorScreen onBack={() => setScreen("advanced-editor")} onPublish={() => setScreen("post")} />;
  if (screen === "post") return <PostScreen onBack={() => setScreen("ai-creator")} onPublish={() => setScreen("publish")} />;
  return <PublishScreen onDone={onExit} />;
}