const config = {
  "BON":  { metro: ["A"],    tram: ["T3"],       chronobus: ["C8", "C11", "C15", "TB11"] },
  "VAI1": { metro: ["D"],    tram: [],            chronobus: ["C6", "C14"] },
  "VAI2": { metro: ["D"],    tram: [],            chronobus: ["C6", "C14", "C19", "C22", "C24", "C25"] },
  "GOR":  { metro: ["D"],    tram: [],            chronobus: ["C21", "C24"] },
  "CUI":  { metro: ["C"],    tram: [],            chronobus: [] },
  "MERP": { metro: ["D"],    tram: ["T6"],        chronobus: ["C15"] },
  "PAR":  { metro: ["D"],    tram: [],            chronobus: [] },
  "SOI":  { metro: ["A"],    tram: [],            chronobus: ["C8", "C15", "TB11"] },
  "ALP":  { metro: [],       tram: ["T2"],        chronobus: ["C25"] },
  "BELA": { metro: [],       tram: ["T2"],        chronobus: [] },
  "MEYP": { metro: [],       tram: ["T3"],        chronobus: [] },
  "MEYZ": { metro: [],       tram: ["T3"],        chronobus: [] },
  "MEYG": { metro: [],       tram: ["T3"],        chronobus: [] },
  "DECC": { metro: [],       tram: ["T3"],        chronobus: [] },
  "DECG": { metro: [],       tram: ["T3"],        chronobus: [] },
  "HFVE": { metro: [],       tram: ["T4"],        chronobus: ["C12"] },
};

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

    const enriched = {
      ...json,
      values: (json.values || []).map((p) => {
        const extra = config[p.id] || {};
        return {
          ...p,
          metro:     extra.metro     || [],
          tram:      extra.tram      || [],
          chronobus: extra.chronobus || [],
        };
      }),
    };

    return res.status(200).json(enriched);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}