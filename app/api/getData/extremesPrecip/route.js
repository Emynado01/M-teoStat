import { getPrecipitationConnection, sql } from "@/utils/db";

export async function GET() {
  try {
    const pool = await getPrecipitationConnection();

    // Exécution de la procédure pour les mois extrêmes
    const moisResult = await pool.request().execute("spMoisPrecipitationExtreme");

    // Exécution de la procédure pour les provinces extrêmes
    const provincesResult = await pool.request().execute("spProvincePluieExtremes");

    return new Response(JSON.stringify({
      mois: moisResult.recordsets.flat(),
      provinces: provincesResult.recordsets.flat()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Erreur API Précipitations Extrêmes :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500
    });
  }
}
