export default async function handler(req, res) {
  try {
    const username = process.env.GRANDLYON_USERNAME;
    const password = process.env.GRANDLYON_PASSWORD;

    if (!username || !password) {
      return res.status(500).json({
        error: "Identifiants Grand Lyon manquants",
      });
    }

    const endpoint =
      "https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaisst/all.json?maxfeatures=100&start=1";

    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    
const response = await fetch(endpoint, {
  headers: {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
    "User-Agent": "pwa-parking-relais-lyon/1.0"
  },
});


    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur lors de l’appel à l’API Grand Lyon",
      });
    }

    const data = await response.json();

    // On retourne les données telles quelles pour la V1
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erreur interne du proxy",
      details: error.message,
    });
  }
}