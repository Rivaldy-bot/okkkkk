import React, { useState, useMemo } from "react";

function formatTime(minutesFloat) {
  if (!isFinite(minutesFloat) || minutesFloat <= 0) return "--:--";
  const totalSeconds = Math.floor(minutesFloat * 60);
  const mm = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const ss = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function App() {
  const [cylVolumeL, setCylVolumeL] = useState(6.8);
  const [pressure, setPressure] = useState(300);
  const [pressureUnit, setPressureUnit] = useState("bar");
  const [rmv, setRmv] = useState(40);
  const [safetyReserveBar, setSafetyReserveBar] = useState(50);
  const [activityFactor, setActivityFactor] = useState(1);

  const results = useMemo(() => {
    const pressureBar =
      pressureUnit === "bar" ? pressure : pressure / 14.5038;
    const usable = Math.max(0, pressureBar - safetyReserveBar);
    const airLiters = cylVolumeL * usable;
    const effectiveRmv = rmv * activityFactor;
    const minutes = airLiters / effectiveRmv;
    return { airLiters, minutes };
  }, [cylVolumeL, pressure, pressureUnit, rmv, safetyReserveBar, activityFactor]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>SCBA Calculator</h1>

      <label>Volume Silinder (L):</label>
      <input type="number" value={cylVolumeL} onChange={e => setCylVolumeL(parseFloat(e.target.value))} />

      <label>Tekanan:</label>
      <input type="number" value={pressure} onChange={e => setPressure(parseFloat(e.target.value))} />
      <select value={pressureUnit} onChange={e => setPressureUnit(e.target.value)}>
        <option value="bar">bar</option>
        <option value="psi">psi</option>
      </select>

      <label>Safety Reserve (bar):</label>
      <input type="number" value={safetyReserveBar} onChange={e => setSafetyReserveBar(parseFloat(e.target.value))} />

      <label>Respiratory Minute Volume (L/min):</label>
      <input type="number" value={rmv} onChange={e => setRmv(parseFloat(e.target.value))} />

      <label>Activity Factor:</label>
      <input type="number" step="0.1" value={activityFactor} onChange={e => setActivityFactor(parseFloat(e.target.value))} />

      <div style={{ marginTop: 20, padding: 10, background: "#f3f4f6", borderRadius: 8 }}>
        <p><b>Total Air:</b> {results.airLiters.toFixed(0)} L</p>
        <p><b>Durasi:</b> {formatTime(results.minutes)}</p>
      </div>
    </div>
  );
}
