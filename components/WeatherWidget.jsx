"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Thermometer,
  CloudRain,
  Wind,
  Cloud,
} from "lucide-react";

export default function WeatherWidget({ city = "Ottawa" }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const key = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(
            city
          )}&aqi=yes&lang=fr`
        );
        if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchWeather();
  }, [city]);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!data) return <div className="text-purple-200">Chargement…</div>;

  // === ICI on adapte la destructuration WeatherAPI ===
  const {
    location: { localtime },
    current: {
      temp_c,
      feelslike_c,
      condition: { text, icon },
      wind_kph,
      wind_dir,
      humidity,
      uv,
      air_quality,
    },
  } = data;

  // Formatage de l’heure
  const time = localtime.split(" ")[1]; // "2025-07-30 15:27" => "15:27"
  const weekday = new Date(localtime).toLocaleDateString("fr-CA", {
    weekday: "long",
  });

  // Petite traduction direction du vent
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const dir = directions[Math.round(parseInt(wind_dir, 10) / 45) % 8] || wind_dir;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 shadow-2xl shadow-purple-500/25 border border-purple-400/30 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-purple-200" />
          <h2 className="text-xl font-semibold">{city}</h2>
        </div>
        <Calendar className="w-5 h-5 text-purple-200" />
      </div>

      <div className="text-sm text-purple-200 mb-6">
        {time} | {weekday}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-6xl font-light mb-2">{Math.round(temp_c)}°C</div>
          <div className="text-purple-200">
            <div>
              Vent : {dir} à {Math.round(wind_kph)} km/h
            </div>
            <div className="text-sm">Ressenti {Math.round(feelslike_c)}°C</div>
          </div>
        </div>
        <div className="text-right">
          <img src={icon} alt={text} className="inline-block w-16 h-16 mb-2" />
          <div className="space-y-1 text-sm text-purple-200">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4" />
              <span>{text}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CloudRain className="w-4 h-4" />
              <span>{air_quality ? `AQI: ${air_quality["us-epa-index"]}` : ""}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
