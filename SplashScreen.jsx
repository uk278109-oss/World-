import React, { useEffect } from "react";

export default function SplashScreen({ onContinue }) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 1400);
    return () => window.clearTimeout(timer);
  }, [onContinue]);

  return (
    <main className="wb-screen wb-splash">
      <div className="wb-brand-mark" aria-hidden="true">W</div>
      <h1>WORLD</h1>
      <p>Be there.</p>
    </main>
  );
}
