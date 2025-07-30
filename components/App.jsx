import React, { useState } from 'react';
import ComparisonPage from '@/components/ComparisonPage';
import WeatherWidget from './WeatherWidget';
import InteractiveChartSection from './Graphique';

import { 
  Cloud, 
  Thermometer, 
  CloudRain, 
  TrendingUp, 
  TrendingDown,
  Users, 
  BarChart3, 
  MapPin,
  Calendar,
  Settings,
  ChevronDown,
  User
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [selectedChart, setSelectedChart] = useState('temperatures');
  const [selectedRegion, setSelectedRegion] = useState('ontario');
  const [selectedYear, setSelectedYear] = useState('2023');

  const teamMembers = [
    {
      name: "Arnaud N'Doli",
      role: "Chef de projet",
      description: "Coordination générale du projet, répartition des tâches et suivi de l'avancement.",
      avatar: "AN"
    },
    {
      name: "Sarah Efesu",
      role: "Développeuse Front-End",
      description: "Responsable de l'interface utilisateur avec React, Next.js et Tailwind CSS.",
      avatar: "SE"
    },
    {
      name: "Joachim Cishugi",
      role: "Développeur Back-End",
      description: "Chargée des bases de données, des procédures stockées et de l'intégration des données météo.",
      avatar: "JC"
    },
    {
      name: "Ameth Diop",
      role: "Responsable Qualité",
      description: "En charge de la rédaction du contenu, du suivi des SRS-DDS et de la cohérence globale du projet.",
      avatar: "AD"
    }
  ];

  if (currentPage === 'comparaison') {
    return <ComparisonPage />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 shadow-lg shadow-purple-500/20">
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
              <button 
                onClick={() => setCurrentPage('accueil')}
                className={`transition-colors duration-300 ${currentPage === 'accueil' ? 'text-white' : 'text-purple-200 hover:text-white'}`}
              >
                Accueil
              </button>
              <button 
                onClick={() => setCurrentPage('comparaison')}
                className={`transition-colors duration-300 ${currentPage === 'comparaison' ? 'text-white' : 'text-purple-200 hover:text-white'}`}
              >
                Comparaison
              </button>
              <a href="#equipe" className="text-purple-200 hover:text-white transition-colors duration-300">À propos</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Weather Widget */}
      <section className="py-12 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 shadow-2xl shadow-purple-500/25 border border-purple-400/30">
              <WeatherWidget city="Ottawa" country="CA" />
            {/* ... autre contenu */}
            </div>

            {/* Welcome Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                Bienvenue sur MeteoStat
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                MeteoStat est une plateforme qui vous donne accès aux statistiques météorologiques des 13 provinces et territoires du Canada. Vous pouvez consulter:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Les températures mensuelles des trois dernières années</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Les niveaux de pollution enregistrés dans chaque province</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Les précipitations (pluie, neige) par mois et par province</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Des comparaisons interactives entre provinces ou périodes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Charts Section */}
      <section id="temperatures" className="py-16 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="container mx-auto px-4">
          <InteractiveChartSection
  selectedChart={selectedChart}
  setSelectedChart={setSelectedChart}
  selectedRegion={selectedRegion}
  setSelectedRegion={setSelectedRegion}
  selectedYear={selectedYear}
  setSelectedYear={setSelectedYear}
/>
        </div>
      </section>

      {/* Detailed Data Section */}
      

      {/* Team Section */}
      <section id="equipe" className="py-16 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
              Notre Équipe
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-purple-400 text-sm">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Results Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-purple-900/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Résultats analytiques
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Temperature Chart */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Température moyenne par mois</h3>
              <div className="relative h-48">
                <svg className="w-full h-full" viewBox="0 0 400 180">
                  <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                  {/* Temperature lines */}
                  <path d="M 40 120 L 80 110 L 120 80 L 160 60 L 200 40 L 240 50 L 280 70 L 320 100 L 360 130" 
                        stroke="#06b6d4" strokeWidth="3" fill="none"/>
                  <path d="M 40 140 L 80 135 L 120 120 L 160 100 L 200 80 L 240 85 L 280 105 L 320 125 L 360 145" 
                        stroke="#3b82f6" strokeWidth="3" fill="none"/>
                  
                  {/* Y-axis labels */}
                  <text x="20" y="45" className="fill-gray-400 text-xs">20</text>
                  <text x="20" y="85" className="fill-gray-400 text-xs">10</text>
                  <text x="20" y="125" className="fill-gray-400 text-xs">0</text>
                  <text x="15" y="165" className="fill-gray-400 text-xs">-10</text>
                </svg>
              </div>
            </div>

            {/* AQI Map */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">AQI moyen par région</h3>
              <div className="relative h-48 flex items-center justify-center">
                <div className="w-48 h-32 relative">
                  {/* Simplified Canada map representation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 rounded-lg opacity-80"></div>
                  <div className="absolute top-4 left-8 w-16 h-12 bg-blue-600 rounded opacity-90"></div>
                  <div className="absolute top-6 right-8 w-20 h-16 bg-blue-400 rounded opacity-80"></div>
                  <div className="absolute bottom-6 left-12 w-24 h-8 bg-blue-800 rounded opacity-95"></div>
                </div>
                <div className="absolute bottom-2 left-6 flex items-center space-x-4 text-xs">
                  <span className="text-gray-400">0</span>
                  <div className="w-20 h-2 bg-gradient-to-r from-blue-300 to-blue-800 rounded"></div>
                  <span className="text-gray-400">100</span>
                </div>
              </div>
            </div>

            {/* Precipitation Chart */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Précipitations par saison</h3>
              <div className="flex items-end justify-around h-32 space-x-2">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-20 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"></div>
                  <span className="text-xs text-gray-400">Printemps</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-24 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t"></div>
                  <span className="text-xs text-gray-400">Été</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-16 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t"></div>
                  <span className="text-xs text-gray-400">Automne</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-14 bg-gradient-to-t from-red-600 to-red-400 rounded-t"></div>
                  <span className="text-xs text-gray-400">Hiver</span>
                </div>
              </div>
            </div>

            {/* Event Comparison Pie Chart */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Comparaison des événements</h3>
              <div className="relative h-32 flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="transparent" stroke="#374151" strokeWidth="2"/>
                  {/* Pie segments */}
                  <path d="M 60 10 A 50 50 0 0 1 95 40 L 60 60 Z" fill="#3b82f6"/>
                  <path d="M 95 40 A 50 50 0 0 1 95 80 L 60 60 Z" fill="#06b6d4"/>
                  <path d="M 95 80 A 50 50 0 1 1 60 10 L 60 60 Z" fill="#ef4444"/>
                </svg>
                <div className="absolute right-8 top-0 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Pluie 40%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                    <span>Neige 35%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Grêle 25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
              MeteoStat
            </h3>
          </div>
          <p className="text-purple-200">
            Plateforme de statistiques climatiques pour le Canada
          </p>
          <div className="mt-4 text-purple-300 text-sm">
            © 2025 MeteoStat. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;