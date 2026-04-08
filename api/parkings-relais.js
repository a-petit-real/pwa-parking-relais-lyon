export default async function handler(req, res) {
  try {
    // 1. Récupération sécurisée des variables d’environnement
    const username = process.env.GRANDLYON_USERNAME;
    const password = process.env.GRANDLYON_PASSWORD;

    if (!username || !password) {
      return res.status(500).json({
        error: "Identifiants Grand Lyon manquants",
      });
    }

    // 2. Endpoint final et minimal (sans paramètres superflus)
    const endpoint =
      "https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaisst/all.json";

    // 3. Encodage Basic Auth
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    // 4. Appel API avec headers stricts (IMPORTANT)
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "User-Agent": "pwa-parking-relais-lyon/1.0"
      },
    });

    // 5. Gestion des erreurs HTTP Grand Lyon
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur lors de l’appel à l’API Grand Lyon",
        status: response.status,
      });
    }

    // 6. Parsing JSON
    const data = await response.json();

    // 7. Cache côté Vercel (important pour limiter la charge)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

    // 8. Réponse finale
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Erreur interne du proxy",
      details: error.message,
    });
  }
}
``