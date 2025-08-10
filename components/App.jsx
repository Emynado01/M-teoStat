import React, { useState } from 'react';
import ComparisonPage from '@/components/ComparisonPage';
import WeatherWidget from './WeatherWidget';
import InteractiveChartSection from './Graphique';
import Link from "next/link";


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
        <Link href="/" className="text-white transition-colors duration-300">
          Accueil
        </Link>
        <Link
          href="/comparaison"
          className="text-purple-200 hover:text-white transition-colors duration-300"
        >
          Comparaison
        </Link>
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