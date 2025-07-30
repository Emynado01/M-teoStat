// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "MeteoStat",
  description: "Plateforme de statistiques climatiques",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      {/*  
        On passe bg-black et text-white sur le body, 
        ainsi tout l’espace entre header et footer sera foncé. 
      */}
      <body className="bg-black text-white flex flex-col min-h-screen">
        

        {/* 
          flex-1 pour pousser le footer en bas, 
          pas besoin de bg ici.
        */}
        <main className="flex-1 px-4 py-2">
          {children}
        </main>

        
      </body>
    </html>
  );
}
