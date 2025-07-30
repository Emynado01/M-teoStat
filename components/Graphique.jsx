"use client";

import { useState, useEffect } from "react";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

export default function InteractiveChartSection() {
  const [selectedChart, setSelectedChart] = useState("temperatures");
  const [selectedRegion, setSelectedRegion] = useState("ontario");
  const [selectedYear, setSelectedYear] = useState("2024");

  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // Liste des provinces (value en minuscules, label pour l’affichage)
  const regions = [
    { value: "ontario", label: "Ontario" },
    { value: "québec", label: "Québec" },
    { value: "colombie-britannique", label: "Colombie-Britannique" },
    { value: "alberta", label: "Alberta" },
    { value: "manitoba", label: "Manitoba" },
    { value: "saskatchewan", label: "Saskatchewan" },
    { value: "nouvelle-écosse", label: "Nouvelle-Écosse" },
    { value: "nouveau-brunswick", label: "Nouveau-Brunswick" },
    { value: "terre-neuve-et-labrador", label: "Terre-Neuve-et-Labrador" },
    { value: "île-du-prince-édouard", label: "Île-du-Prince-Édouard" },
    { value: "nunavut", label: "Nunavut" },
    { value: "territoires-du-nord-ouest", label: "Territoires du Nord-Ouest" },
    { value: "yukon", label: "Yukon" },
  ];

  // Fetch à chaque changement de chart/region/year
  useEffect(() => {
    fetchData();
  }, [selectedChart, selectedRegion, selectedYear]);

  async function fetchData() {
    setLoading(true);
    setError(undefined);

    let endpoint = `/api/getData/temperatures?province=${selectedRegion}&year=${selectedYear}`;
    if (selectedChart === "precipitations") {
      endpoint = `/api/getData/precipitations?province=${selectedRegion}&year=${selectedYear}`;
    } else if (selectedChart === "pollution") {
      endpoint = `/api/getData/pollution?province=${selectedRegion}&year=${selectedYear}`;
    }

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const json = await res.json();

      setDataPoints(
        json.map((item) => ({
          month: item.mois,
          value:
            item.temperature ??
            item.precipitation ??
            item.pollution ??
            0,
        }))
      );
    } catch (e) {
      setError(e.message);
      setDataPoints([]);
    } finally {
      setLoading(false);
    }
  }

  const hasData = dataPoints.length > 0;
  const months = hasData ? dataPoints.map((pt) => pt.month) : [];
  const values = hasData ? dataPoints.map((pt) => pt.value) : [];
  const maxV = hasData ? Math.max(...values) : 0;
  const minV = hasData ? Math.min(...values) : 0;
  const range = hasData ? maxV - minV || 1 : 1;
  const svgPoints = hasData
    ? dataPoints.map((pt, i) => ({
        x: 120 + (i * 660) / (dataPoints.length - 1),
        y: 250 - (((pt.value - minV) / range) * 200),
      }))
    : [];

  const regionLabel =
    regions.find((r) => r.value === selectedRegion)?.label ||
    selectedRegion;

  // Prépare les données détaillées (trends et labels)
  const detailed = dataPoints.map((pt, i) => {
    // trend : up/down/stable
    const prev = values[i - 1];
    let trend = "stable";
    if (prev !== undefined) {
      trend = pt.value > prev ? "up" : pt.value < prev ? "down" : "stable";
    }
    return {
      month: pt.month.charAt(0).toUpperCase() + pt.month.slice(1),
      value:
        selectedChart === "temperatures"
          ? `${pt.value}°C`
          : selectedChart === "precipitations"
          ? `${pt.value} mm`
          : `${pt.value} AQI`,
      trend,
    };
  });

  // Calculs de summary
  const avg =
    hasData
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      : 0;
  const maxIdx = values.indexOf(maxV);
  const minIdx = values.indexOf(minV);

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-purple-900/10">
      <div className="container mx-auto px-4">

        {/* -- GRAPH */}
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
          Graphique interactif
        </h2>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {/* chart type */}
          <div className="relative">
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="bg-gray-800 border border-purple-500/30 text-white px-4 py-2 rounded-lg pr-10 focus:outline-none"
            >
              <option value="temperatures">Températures</option>
              <option value="precipitations">Précipitations</option>
              <option value="pollution">Pollution</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          {/* region */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-gray-800 border border-purple-500/30 text-white px-4 py-2 rounded-lg pr-10 focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          {/* year */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-800 border border-purple-500/30 text-white px-4 py-2 rounded-lg pr-10 focus:outline-none"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-4">{error}</div>
        )}

        <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm mb-16">
          <h3 className="text-xl font-semibold mb-6 text-center">
            {selectedChart === "temperatures"
              ? "Températures"
              : selectedChart === "precipitations"
              ? "Précipitations"
              : "Pollution"}{" "}
            annuelles en {regionLabel} en {selectedYear}
          </h3>
          <div className="relative h-80">
            {hasData ? (
              <svg className="w-full h-full" viewBox="0 0 800 300">
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {[50, 150, 250].map((y) => (
                  <line
                    key={y}
                    x1="60"
                    y1={y}
                    x2="750"
                    y2={y}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}
                {svgPoints.map((pt) => (
                  <line
                    key={pt.x}
                    x1={pt.x}
                    y1="50"
                    x2={pt.x}
                    y2="250"
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}
                <path
                  d={
                    "M " +
                    svgPoints.map((pt) => `${pt.x} ${pt.y}`).join(" L ") +
                    ` L ${svgPoints[svgPoints.length - 1].x} 250 L ${svgPoints[0].x} 250 Z`
                  }
                  fill="url(#chartGradient)"
                />
                <path
                  d={
                    "M " +
                    svgPoints.map((pt) => `${pt.x} ${pt.y}`).join(" L ")
                  }
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  fill="none"
                />
                {svgPoints.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#8b5cf6"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                ))}
                {svgPoints.map((pt, i) =>
                  i % 2 === 0 ? (
                    <text
                      key={i}
                      x={pt.x}
                      y="275"
                      transform={`rotate(45 ${pt.x} 275)`}
                      textAnchor="start"
                      className="fill-gray-400 text-sm"
                    >
                      {months[i]}
                    </text>
                  ) : null
                )}
                <text
                  x="400"
                  y="295"
                  className="fill-gray-400 text-sm"
                  textAnchor="middle"
                >
                  Mois
                </text>
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Aucune donnée à afficher
              </div>
            )}
          </div>
        </div>

        {/* -- DONNÉES DÉTAILLÉES */}
        <section id="detailed-data" className="py-16 bg-gradient-to-b from-purple-900/10 to-transparent">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Données détaillées –{" "}
            {selectedChart === "temperatures"
              ? "Températures"
              : selectedChart === "precipitations"
              ? "Précipitations"
              : "Pollution"}{" "}
            {regionLabel} {selectedYear}
          </h2>
          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detailed.map((d, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-purple-300">{d.month}</h3>
                    {d.trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {d.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {d.trend === "stable" && (
                      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{d.value}</div>
                  <div className="text-xs text-gray-400">
                    {selectedChart === "temperatures"
                      ? "Température moyenne"
                      : selectedChart === "precipitations"
                      ? "Précipitations totales"
                      : "Indice de qualité de l'air"}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-purple-300 mb-1">Moyenne annuelle</div>
                <div className="text-xl font-bold text-white">
                  {selectedChart === "temperatures"
                    ? `${avg}°C`
                    : selectedChart === "precipitations"
                    ? `${avg} mm`
                    : `${avg} AQI`}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-green-300 mb-1">Valeur maximale</div>
                <div className="text-xl font-bold text-white">
                  {selectedChart === "temperatures"
                    ? `${maxV}°C (${detailed[maxIdx]?.month})`
                    : selectedChart === "precipitations"
                    ? `${maxV} mm (${detailed[maxIdx]?.month})`
                    : `${maxV} AQI (${detailed[maxIdx]?.month})`}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-blue-300 mb-1">Valeur minimale</div>
                <div className="text-xl font-bold text-white">
                  {selectedChart === "temperatures"
                    ? `${minV}°C (${detailed[minIdx]?.month})`
                    : selectedChart === "precipitations"
                    ? `${minV} mm (${detailed[minIdx]?.month})`
                    : `${minV} AQI (${detailed[minIdx]?.month})`}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4 text-center">
                <div className="text-sm text-orange-300 mb-1">Variation</div>
                <div className="text-xl font-bold text-white">
                  {selectedChart === "temperatures"
                    ? `${(maxV - minV).toFixed(1)}°C`
                    : selectedChart === "precipitations"
                    ? `${(maxV - minV).toFixed(1)} mm`
                    : `${(maxV - minV).toFixed(1)} AQI`}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
