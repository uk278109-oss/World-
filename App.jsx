import { Navigate, Route, Routes } from 'react-router-dom';

function Bootstrap() {
  return (
    <main className="world-shell">
      <section className="world-splash" aria-label="WORLD">
        <div className="world-logo-mark">W</div>
        <h1>WORLD</h1>
        <p>Create. Connect. Discover. Earn.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Bootstrap />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
