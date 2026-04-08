export default async function handler(req, res) {
  try {
    const username = process.env.GRANDLYON_USERNAME;
    const password = process.env.GRANDLYON_PASSWORD;

    if (!username || !password) {
      return res.status(500).json({ error: "Identifiants manquants" });
    }

    const endpoint =
      "https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaisst/all.json";

    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "User-Agent": "pwa-parking-relais-lyon/1.0"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erreur API Grand Lyon",
        status: response.status
      });
    }

    const data = await response.json();

    // 🔴 IMPORTANT :
    // L’API renvoie un TABLEAU D’OBJETS (confirmé par ta console)
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({
      error: "Erreur proxy",
      details: e.message
    });
  }
}