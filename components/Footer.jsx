// components/Footer.jsx
import { Cloud } from "lucide-react";

export default function Footer() {
  return (
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
  );
}
