// components/Header.jsx
"use client";
import { Cloud } from "lucide-react";

export default function Header({ currentPage, setCurrentPage }) {
  return (
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
              onClick={() => setCurrentPage("accueil")}
              className={`transition-colors duration-300 ${currentPage === "accueil" ? "text-white" : "text-purple-200 hover:text-white"}`}
            >
              Accueil
            </button>
            <a href="#temperatures" className="text-purple-200 hover:text-white transition-colors duration-300">Températures</a>
            <a href="#precipitations" className="text-purple-200 hover:text-white transition-colors duration-300">Précipitations</a>
            <a href="#pollution" className="text-purple-200 hover:text-white transition-colors duration-300">Pollution</a>
            <button 
              onClick={() => setCurrentPage("comparaison")}
              className={`transition-colors duration-300 ${currentPage === "comparaison" ? "text-white" : "text-purple-200 hover:text-white"}`}
            >
              Comparaison
            </button>
            <a href="#equipe" className="text-purple-200 hover:text-white transition-colors duration-300">À propos</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
