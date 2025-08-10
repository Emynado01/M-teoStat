"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Cloud,        // ← AJOUT
  TrendingUp, TrendingDown, Calendar, MapPin,
  Thermometer, CloudRain, Wind, ChevronDown, ArrowRight
} from "lucide-react";
import Link from "next/link"; // <-- à ajouter en haut

// Codes ↦ noms attendus par la BDD (p.nom)
const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Québec" },
  { code: "BC", name: "Colombie-Britannique" },
  { code: "AB", name: "Alberta" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nouvelle-Écosse" },
  { code: "NB", name: "Nouveau-Brunswick" },
  { code: "NL", name: "Terre-Neuve-et-Labrador" },
  { code: "PE", name: "Île-du-Prince-Édouard" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Territoires du Nord-Ouest" },
  { code: "NU", name: "Nunavut" },
];

const MONTH_ORDER = [
  "janvier","fevrier","mars","avril","mai","juin",
  "juillet","aout","septembre","octobre","novembre","decembre",
];
const MONTH_LABELS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const norm = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

async function fetchSeries(metric, provinceName, year) {
  const base =
    metric === "temperatures"
      ? "/api/getData/temperatures"
      : metric === "precipitations"
      ? "/api/getData/precipitations"
      : "/api/getData/pollution";
  const url = `${base}?province=${encodeURIComponent(provinceName)}&year=${encodeURIComponent(
    year
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur ${res.status} en chargeant ${metric} ${year}`);

  const rows = await res.json(); // [{ mois, temperature|precipitation|pollution }, ...]
  const byMonth = new Array(12).fill(undefined);

  rows.forEach((r) => {
    const idx = MONTH_ORDER.indexOf(norm(r.mois));
    if (idx >= 0) {
      byMonth[idx] =
        r.temperature ?? r.precipitation ?? r.pollution ?? undefined;
    }
  });

  // On garantit un tableau numérique (null si mois manquant)
  return byMonth.map((v) => (typeof v === "number" ? v : null));
}

function avg(arr) {
  const nums = arr.filter((x) => typeof x === "number");
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function pctChange(a, b) {
  const A = avg(a);
  const B = avg(b);
  if (A === null || B === null || A === 0) return null;
  return ((B - A) / A) * 100;
}

function renderChart(data1, data2, title, unit, color1, color2) {
  const nums = [...data1, ...data2].filter((x) => typeof x === "number");
  const minValue = nums.length ? Math.min(...nums) : 0;
  const maxValue = nums.length ? Math.max(...nums) : 1;
  const range = Math.max(1e-6, maxValue - minValue);

  const xy = (val, i) => {
    const x = 120 + i * 55;
    const y =
      typeof val === "number"
        ? 250 - ((val - minValue) / range) * 180
        : 250; // trous à la base si valeur manquante
    return { x, y };
  };

  const linePath = (data) =>
    "M " +
    data
      .map((v, i) => {
        const { x, y } = xy(v, i);
        return `${x} ${y}`;
      })
      .join(" L ");

  


  return (
    <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-6 text-center">{title}</h3>
      <div className="relative h-80">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          {[50, 100, 150, 200, 250].map((y) => (
            <line key={y} x1="60" y1={y} x2="750" y2={y} stroke="#374151" strokeWidth="1" opacity="0.3" />
          ))}
          {MONTH_LABELS.map((_, i) => {
            const x = 120 + i * 55;
            return <line key={i} x1={x} y1="50" x2={x} y2="250" stroke="#374151" strokeWidth="1" opacity="0.3" />;
          })}

          {/* Courbes */}
          <path d={linePath(data1)} stroke={color1} strokeWidth="3" fill="none" />
          <path d={linePath(data2)} stroke={color2} strokeWidth="3" fill="none" />

          {/* Points */}
          {data1.map((v, i) => {
            const { x, y } = xy(v, i);
            return <circle key={`a-${i}`} cx={x} cy={y} r="4" fill={color1} className="hover:r-6 transition-all cursor-pointer" />;
          })}
          {data2.map((v, i) => {
            const { x, y } = xy(v, i);
            return <circle key={`b-${i}`} cx={x} cy={y} r="4" fill={color2} className="hover:r-6 transition-all cursor-pointer" />;
          })}

          {/* Axes */}
          <text x="40" y="55" className="fill-gray-400 text-sm">{maxValue.toFixed(0)}</text>
          <text x="40" y="105" className="fill-gray-400 text-sm">{(maxValue - range * 0.25).toFixed(0)}</text>
          <text x="40" y="155" className="fill-gray-400 text-sm">{(maxValue - range * 0.5).toFixed(0)}</text>
          <text x="40" y="205" className="fill-gray-400 text-sm">{(maxValue - range * 0.75).toFixed(0)}</text>
          <text x="40" y="255" className="fill-gray-400 text-sm">{minValue.toFixed(0)}</text>

          {MONTH_LABELS.map((m, i) => (
            <text key={i} x={120 + i * 55} y="275" className="fill-gray-400 text-sm" textAnchor="middle">
              {m}
            </text>
          ))}
          <text x="400" y="295" className="fill-gray-400 text-sm" textAnchor="middle">Mois</text>
          <text x="25" y="160" className="fill-gray-400 text-sm" textAnchor="middle" transform="rotate(-90 25 160)">
            {unit}
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const [selectedRegion, setSelectedRegion] = useState("ON");
  const [year1, setYear1] = useState("2022");
  const [year2, setYear2] = useState("2023");
  const [currentPage, setCurrentPage] = useState("comparaison");

  const [temps1, setTemps1] = useState(Array(12).fill(null));
  const [temps2, setTemps2] = useState(Array(12).fill(null));
  const [prec1, setPrec1] = useState(Array(12).fill(null));
  const [prec2, setPrec2] = useState(Array(12).fill(null));
  const [aqi1, setAqi1] = useState(Array(12).fill(null));
  const [aqi2, setAqi2] = useState(Array(12).fill(null));

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const years = ["2022", "2023", "2024"];

  const currentProvinceName = useMemo(
    () => PROVINCES.find((p) => p.code === selectedRegion)?.name ?? selectedRegion,
    [selectedRegion]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setErr("");
        setLoading(true);

        const [
          t1, t2,
          p1, p2,
          q1, q2,
        ] = await Promise.all([
          fetchSeries("temperatures", currentProvinceName, year1),
          fetchSeries("temperatures", currentProvinceName, year2),
          fetchSeries("precipitations", currentProvinceName, year1),
          fetchSeries("precipitations", currentProvinceName, year2),
          fetchSeries("pollution", currentProvinceName, year1),
          fetchSeries("pollution", currentProvinceName, year2),
        ]);

        if (!cancelled) {
          setTemps1(t1); setTemps2(t2);
          setPrec1(p1);  setPrec2(p2);
          setAqi1(q1);   setAqi2(q2);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || "Erreur de chargement des données");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentProvinceName, year1, year2]);

  const tempDelta = pctChange(temps1, temps2);
  const precDelta = pctChange(prec1, prec2);
  const aqiDelta = pctChange(aqi1, aqi2);

  const tempAvg1 = avg(temps1), tempAvg2 = avg(temps2);
  const precAvg1 = avg(prec1),  precAvg2 = avg(prec2);
  const aqiAvg1 = avg(aqi1),    aqiAvg2 = avg(aqi2);

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4">
        { /* Header */}
<header className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 shadow-lg shadow-purple-500/20 rounded-2xl mb-8">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
          <Cloud className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
          MeteoStat
        </h1>
      </div>

      <nav className="hidden md:flex space-x-8">
        {/* Accueil -> page d'accueil */}
        <Link
          href="/"
          onClick={() => setCurrentPage("accueil")}
          className={`transition-colors duration-300 ${
            currentPage === "accueil"
              ? "text-white"
              : "text-purple-200 hover:text-white"
          }`}
        >
          Accueil
        </Link>

        <button
          onClick={() => setCurrentPage("comparaison")}
          className={`transition-colors duration-300 ${
            currentPage === "comparaison"
              ? "text-white"
              : "text-purple-200 hover:text-white"
          }`}
        >
          Comparaison
        </button>

        <a
          href="#equipe"
          className="text-purple-200 hover:text-white transition-colors duration-300"
        >
          À propos
        </a>
      </nav>
    </div>
  </div>
</header>
        {/* Titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Comparaison Climatique (données réelles)
          </h1>
          <p className="text-gray-300 text-lg">
            Compare {year1} vs {year2} pour {currentProvinceName}
          </p>
        </div>

        {/* Contrôles */}
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm mb-8">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Région
              </label>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:border-purple-400 focus:outline-none appearance-none pr-10"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" /> Première année
              </label>
              <div className="relative">
                <select
                  value={year1}
                  onChange={(e) => setYear1(e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:border-purple-400 focus:outline-none appearance-none pr-10"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" /> Deuxième année
              </label>
              <div className="relative">
                <select
                  value={year2}
                  onChange={(e) => setYear2(e.target.value)}
                  className="w-full bg-gray-800 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:border-purple-400 focus:outline-none appearance-none pr-10"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {loading && <div className="text-purple-200">Chargement des données…</div>}
          {err && <div className="text-red-400">{err}</div>}
        </div>

        {/* Résumés (moyennes réelles + % de variation) */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold">Températures</h3>
              </div>
              {tempDelta !== null && (tempDelta > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-300">{year1}:</span><span className="font-semibold">{tempAvg1?.toFixed(1) ?? "—"}°C</span></div>
              <div className="flex justify-between"><span className="text-gray-300">{year2}:</span><span className="font-semibold">{tempAvg2?.toFixed(1) ?? "—"}°C</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Variation:</span>
                <span className={`font-semibold ${tempDelta !== null && tempDelta > 0 ? "text-green-400" : "text-red-400"}`}>
                  {tempDelta === null ? "—" : `${tempDelta > 0 ? "+" : ""}${tempDelta.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold">Précipitations</h3>
              </div>
              {precDelta !== null && (precDelta > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-300">{year1}:</span><span className="font-semibold">{precAvg1?.toFixed(1) ?? "—"} mm</span></div>
              <div className="flex justify-between"><span className="text-gray-300">{year2}:</span><span className="font-semibold">{precAvg2?.toFixed(1) ?? "—"} mm</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Variation:</span>
                <span className={`font-semibold ${precDelta !== null && precDelta > 0 ? "text-green-400" : "text-red-400"}`}>
                  {precDelta === null ? "—" : `${precDelta > 0 ? "+" : ""}${precDelta.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wind className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Pollution (AQI)</h3>
              </div>
              {aqiDelta !== null && (aqiDelta < 0 ? (
                <TrendingDown className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-400" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-300">{year1}:</span><span className="font-semibold">{aqiAvg1?.toFixed(0) ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-300">{year2}:</span><span className="font-semibold">{aqiAvg2?.toFixed(0) ?? "—"}</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Variation:</span>
                <span className={`font-semibold ${aqiDelta !== null && aqiDelta < 0 ? "text-green-400" : "text-red-400"}`}>
                  {aqiDelta === null ? "—" : `${aqiDelta > 0 ? "+" : ""}${aqiDelta.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques de comparaison (séries réelles) */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            {PROVINCES.find((r) => r.code === selectedRegion)?.name}
          </h2>
          {renderChart(temps1, temps2, `Températures ${year1} vs ${year2}`, "°C", "#f97316", "#ef4444")}
          {renderChart(prec1,  prec2,  `Précipitations ${year1} vs ${year2}`, "mm", "#3b82f6", "#06b6d4")}
          {renderChart(aqi1,   aqi2,   `Pollution (AQI) ${year1} vs ${year2}`, "AQI", "#8b5cf6", "#ec4899")}
        </div>

        {/* Analyse courte */}
        <div className="mt-12 bg-gray-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Analyse Comparative
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-300">Tendances observées</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Températures {tempDelta === null ? "—" : tempDelta > 0 ? "en hausse" : "en baisse"} ({tempDelta === null ? "—" : `${tempDelta.toFixed(1)}%`})
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Précipitations {precDelta === null ? "—" : precDelta > 0 ? "en hausse" : "en baisse"} ({precDelta === null ? "—" : `${precDelta.toFixed(1)}%`})
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    AQI {aqiDelta === null ? "—" : aqiDelta < 0 ? "en amélioration" : "en dégradation"} ({aqiDelta === null ? "—" : `${aqiDelta.toFixed(1)}%`})
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-300">À suivre</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3"><ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" /><span>Comparer mois par mois une fois plus d’historique chargé</span></li>
                <li className="flex items-start space-x-3"><ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" /><span>Repérer les anomalies (pics/creux) et leurs causes</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
