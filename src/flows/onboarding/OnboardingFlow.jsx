import React, { useCallback, useState } from "react";
import SplashScreen from "./SplashScreen";
import WelcomeScreen from "./WelcomeScreen";
import CreateAccountScreen from "./CreateAccountScreen";
import LoginScreen from "./LoginScreen";
import InterestsScreen from "./InterestsScreen";
import FeedSelectionScreen from "./FeedSelectionScreen";
import HomeScreen from "./HomeScreen";

export default function OnboardingFlow() {
  const [step, setStep] = useState("splash");
  const [profile, setProfile] = useState(null);

  const to = useCallback((next) => setStep(next), []);

  if (step === "splash") {
    return <SplashScreen onContinue={() => to("welcome")} />;
  }

  if (step === "welcome") {
    return <WelcomeScreen onCreate={() => to("create")} onLogin={() => to("login")} />;
  }

  if (step === "create") {
    return (
      <CreateAccountScreen
        onBack={() => to("welcome")}
        onCreated={(data) => {
          setProfile(data);
          to("interests");
        }}
      />
    );
  }

  if (step === "login") {
    return (
      <LoginScreen
        onBack={() => to("welcome")}
        onLoggedIn={(data) => {
          setProfile(data);
          to("interests");
        }}
      />
    );
  }

  if (step === "interests") {
    return <InterestsScreen onContinue={() => to("feed-selection")} />;
  }

  if (step === "feed-selection") {
    return <FeedSelectionScreen onContinue={() => to("home")} />;
  }

  return <HomeScreen profile={profile} />;
}
