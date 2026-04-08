export default async function handler(req, res) {
  try {
    const username = process.env.GRANDLYON_USERNAME;
    const password = process.env.GRANDLYON_PASSWORD;

    if (!username || !password) {
      return res.status(500).json({ error: "Identifiants manquants" });
    }

    const endpoint =
      "https://data.grandlyon.com/fr/datapusher/ws/rdata/tcl_sytral.tclparcrelaistr/all.json";

    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "User-Agent": "pwa-parking-relais-lyon/1.0"
      }
    });

    const json = await response.json();
    return res.status(200).json(json);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
``