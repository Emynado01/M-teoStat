import { getPollutionConnection, sql } from "@/utils/db";

export async function GET() {
  try {
    const pool = await getPollutionConnection();

    // Exécution de la procédure pour les mois extrêmes
    const moisResult = await pool.request().execute("spMoisPollutionExtreme");

    // Exécution de la procédure pour les provinces extrêmes
    const provincesResult = await pool.request().execute("spProvincePollutionExtremes");

    // Combinaison des résultats
    const data = [
      ...moisResult.recordsets.flat(),
      ...provincesResult.recordsets.flat()
    ];

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur API Pollution Extrêmes :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500
    });
  }
}
