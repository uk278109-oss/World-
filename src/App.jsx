import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import OnboardingFlow from "./flows/onboarding/OnboardingFlow";
import "./flows/onboarding/onboarding.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
