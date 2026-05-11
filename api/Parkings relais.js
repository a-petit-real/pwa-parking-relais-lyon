import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(__dirname, "../parkings-config.json"), "utf8")
);

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
        "User-Agent": "pwa-parking-relais-lyon/1.0",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Erreur API Grand Lyon (${response.status})` });
    }

    const json = await response.json();

    // Enrichissement avec le mapping local
    const enriched = {
      ...json,
      values: (json.values || []).map((p) => {
        const extra = config[p.id] || {};
        return {
          ...p,
          metro:      extra.metro      || [],
          tram:       extra.tram       || [],
          chronobus:  extra.chronobus  || [],
        };
      }),
    };

    return res.status(200).json(enriched);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}