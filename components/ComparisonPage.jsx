"use client";
import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  ChevronDown,
  ArrowRight
} from "lucide-react";

export default function ComparisonPage() {
  const [selectedRegion, setSelectedRegion] = useState("ON");
  const [year1, setYear1] = useState("2022");
  const [year2, setYear2] = useState("2023");

  const regions = [
    { code: "ON", name: "Ontario" },
    { code: "QC", name: "Québec" },
    { code: "BC", name: "Colombie-Britannique" },
    { code: "AB", name: "Alberta" },
    { code: "MB", name: "Manitoba" },
    { code: "SK", name: "Saskatchewan" },
    { code: "NS", name: "Nouvelle-Écosse" },
    { code: "NB", name: "Nouveau-Brunswick" },
  ];

  const years = ["2021", "2022", "2023"];

  const comparisonData = {
    temperatures: {
      [year1]: [5, 4, 8, 14, 20, 24, 26, 25, 21, 15, 9, 6],
      [year2]: [7, 6, 10, 16, 22, 26, 28, 27, 23, 17, 11, 8],
    },
    precipitations: {
      [year1]: [65, 55, 70, 80, 85, 90, 95, 88, 75, 70, 60, 58],
      [year2]: [70, 60, 75, 85, 90, 95, 100, 92, 80, 75, 65, 62],
    },
    pollution: {
      [year1]: [45, 42, 38, 35, 30, 28, 32, 35, 40, 43, 46, 48],
      [year2]: [40, 38, 35, 32, 28, 25, 30, 33, 38, 41, 44, 46],
    },
  };

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  function calculateAverage(data) {
    return (data.reduce((sum, val) => sum + val, 0) / data.length).toFixed(1);
  }

  function calculateChange(data1, data2) {
    const avg1 = parseFloat(calculateAverage(data1));
    const avg2 = parseFloat(calculateAverage(data2));
    return ((avg2 - avg1) / avg1) * 100;
  }

  function renderChart(data1, data2, title, unit, color1, color2) {
    const maxValue = Math.max(...data1, ...data2);
    const minValue = Math.min(...data1, ...data2);
    const range = maxValue - minValue;

    return (
      <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-6 text-center">{title}</h3>
        <div className="relative h-80">
          <svg className="w-full h-full" viewBox="0 0 800 300">
            {/* Grille */}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={y} x1="60" y1={y} x2="750" y2={y} stroke="#374151" strokeWidth="1" opacity="0.3" />
            ))}
            {months.map((_, i) => {
              const x = 120 + i * 55;
              return <line key={i} x1={x} y1="50" x2={x} y2="250" stroke="#374151" strokeWidth="1" opacity="0.3" />;
            })}

            {/* Courbes */}
            <path
              d={`M ${data1
                .map((val, i) => `${120 + i * 55} ${250 - ((val - minValue) / range) * 180}`)
                .join(" L ")}`}
              stroke={color1}
              strokeWidth="3"
              fill="none"
            />
            <path
              d={`M ${data2
                .map((val, i) => `${120 + i * 55} ${250 - ((val - minValue) / range) * 180}`)
                .join(" L ")}`}
              stroke={color2}
              strokeWidth="3"
              fill="none"
            />

            {/* Points de données */}
            {data1.map((val, i) => {
              const x = 120 + i * 55;
              const y = 250 - ((val - minValue) / range) * 180;
              return <circle key={`a-${i}`} cx={x} cy={y} r="4" fill={color1} className="hover:r-6 transition-all cursor-pointer" />;
            })}
            {data2.map((val, i) => {
              const x = 120 + i * 55;
              const y = 250 - ((val - minValue) / range) * 180;
              return <circle key={`b-${i}`} cx={x} cy={y} r="4" fill={color2} className="hover:r-6 transition-all cursor-pointer" />;
            })}

            {/* Étiquettes axes */}
            <text x="40" y="55" className="fill-gray-400 text-sm">{maxValue.toFixed(0)}</text>
            <text x="40" y="105" className="fill-gray-400 text-sm">{(maxValue * 0.75).toFixed(0)}</text>
            <text x="40" y="155" className="fill-gray-400 text-sm">{(maxValue * 0.5).toFixed(0)}</text>
            <text x="40" y="205" className="fill-gray-400 text-sm">{(maxValue * 0.25).toFixed(0)}</text>
            <text x="40" y="255" className="fill-gray-400 text-sm">{minValue.toFixed(0)}</text>

            {months.map((month, i) => (
              <text key={i} x={120 + i * 55} y="275" className="fill-gray-400 text-sm" textAnchor="middle">
                {month}
              </text>
            ))}
            <text x="400" y="295" className="fill-gray-400 text-sm" textAnchor="middle">
              Mois
            </text>
            <text x="25" y="160" className="fill-gray-400 text-sm" textAnchor="middle" transform="rotate(-90 25 160)">
              {unit}
            </text>
          </svg>
        </div>

        {/* Légende */}
        <div className="flex justify-center space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color1 }}></div>
            <span className="text-sm text-gray-300">{year1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color2 }}></div>
            <span className="text-sm text-gray-300">{year2}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4">
        {/* Titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Comparaison Climatique
          </h1>
          <p className="text-gray-300 text-lg">
            Comparez les données climatiques entre deux années pour une même région
          </p>
        </div>

        {/* Contrôles */}
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm mb-8">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            {/* Région */}
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
                  {regions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Année 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Première année
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

            {/* Année 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Deuxième année
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
        </div>

        {/* Résumés */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Températures */}
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold">Températures</h3>
              </div>
              {calculateChange(comparisonData.temperatures[year1], comparisonData.temperatures[year2]) > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">{year1}:</span>
                <span className="font-semibold">{calculateAverage(comparisonData.temperatures[year1])}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">{year2}:</span>
                <span className="font-semibold">{calculateAverage(comparisonData.temperatures[year2])}°C</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Variation:</span>
                <span className={`font-semibold ${calculateChange(comparisonData.temperatures[year1], comparisonData.temperatures[year2]) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calculateChange(comparisonData.temperatures[year1], comparisonData.temperatures[year2]) > 0 ? '+' : ''}
                  {calculateChange(comparisonData.temperatures[year1], comparisonData.temperatures[year2]).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Précipitations */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold">Précipitations</h3>
              </div>
              {calculateChange(comparisonData.precipitations[year1], comparisonData.precipitations[year2]) > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">{year1}:</span>
                <span className="font-semibold">{calculateAverage(comparisonData.precipitations[year1])}mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">{year2}:</span>
                <span className="font-semibold">{calculateAverage(comparisonData.precipitations[year2])}mm</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Variation:</span>
                <span className={`font-semibold ${calculateChange(comparisonData.precipitations[year1], comparisonData.precipitations[year2]) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calculateChange(comparisonData.precipitations[year1], comparisonData.precipitations[year2]) > 0 ? '+' : ''}
                  {calculateChange(comparisonData.precipitations[year1], comparisonData.precipitations[year2]).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Pollution */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wind className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Pollution (AQI)</h3>
              </div>
              {calculateChange(comparisonData.pollution[year1], comparisonData.pollution[year2]) < 0 ? (
                <TrendingDown className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">{year1}:</span>
                <span className="font-semibold">{calculateAverage(comparisonData.pollution[year1])}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">{year2}:</span>
                <span className="font-semibold">{calculateAverage(comparisonData.pollution[year2])}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Variation:</span>
                <span className={`font-semibold ${calculateChange(comparisonData.pollution[year1], comparisonData.pollution[year2]) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calculateChange(comparisonData.pollution[year1], comparisonData.pollution[year2]) > 0 ? '+' : ''}
                  {calculateChange(comparisonData.pollution[year1], comparisonData.pollution[year2]).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Graphiques de Comparaison – {regions.find((r) => r.code === selectedRegion)?.name}
          </h2>
          {renderChart(
            comparisonData.temperatures[year1],
            comparisonData.temperatures[year2],
            `Températures ${year1} vs ${year2}`,
            "°C",
            "#f97316",
            "#ef4444"
          )}
          {renderChart(
            comparisonData.precipitations[year1],
            comparisonData.precipitations[year2],
            `Précipitations ${year1} vs ${year2}`,
            "mm",
            "#3b82f6",
            "#06b6d4"
          )}
          {renderChart(
            comparisonData.pollution[year1],
            comparisonData.pollution[year2],
            `Pollution (AQI) ${year1} vs ${year2}`,
            "AQI",
            "#8b5cf6",
            "#ec4899"
          )}
        </div>

        {/* Analyse & Recommandations */}
        <div className="mt-12 bg-gray-900/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Analyse Comparative
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-300">Tendances Observées</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Les températures ont{" "}
                    {calculateChange(comparisonData.temperatures[year1], comparisonData.temperatures[year2]) > 0
                      ? "augmenté"
                      : "diminué"}{" "}
                    de {Math.abs(calculateChange(comparisonData.temperatures[year1], comparisonData.temperatures[year2])).toFixed(1)}%
                    entre {year1} et {year2}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Les précipitations ont{" "}
                    {calculateChange(comparisonData.precipitations[year1], comparisonData.precipitations[year2]) > 0
                      ? "augmenté"
                      : "diminué"}{" "}
                    de {Math.abs(calculateChange(comparisonData.precipitations[year1], comparisonData.precipitations[year2])).toFixed(1)}%
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    La qualité de l'air s'est{" "}
                    {calculateChange(comparisonData.pollution[year1], comparisonData.pollution[year2]) < 0
                      ? "améliorée"
                      : "dégradée"}{" "}
                    avec une variation de {calculateChange(comparisonData.pollution[year1], comparisonData.pollution[year2]).toFixed(1)}% de l'AQI
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-300">Recommandations</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Surveiller les tendances saisonnières pour une meilleure prédiction</span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Analyser l'impact des changements climatiques sur la région</span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Mettre en place des mesures d'adaptation si nécessaire</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
