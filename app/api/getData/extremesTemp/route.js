import { getTempConnection, sql } from "@/utils/db";

export async function GET() {
  try {
    const pool = await getTempConnection();

    // Exécuter la procédure pour les mois extrêmes
    const moisResult = await pool.request().execute("spLesMoisExtremes");

    // Exécuter la procédure pour les provinces extrêmes
    const provinceResult = await pool.request().execute("spProvinceExtremes");
    
    const moisExtremes = moisResult.recordsets[0].concat(moisResult.recordsets[1]);
    const provincesExtremes = provinceResult.recordsets[0].concat(provinceResult.recordsets[1]);

    return new Response(JSON.stringify({
      mois: moisExtremes,
      provinces: provincesExtremes
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Erreur API ExtremesTemp:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  }
}
