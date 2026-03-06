export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  const BASE_URL = "https://script.google.com/macros/s/AKfycbya-ldjTICZMH4J009ZWjVnHUuH2m554ZbhjrWCO911BtoyR-vV0951O5oV1OBL2_Jd/exec";

  try {

    let response;

    if (req.method === "GET") {
      const query = new URLSearchParams(req.query).toString();
      response = await fetch(`${BASE_URL}?${query}`, {
        method: "GET"
      });
    }

    if (req.method === "POST") {
      const params = new URLSearchParams();

      Object.entries(req.body || {}).forEach(([key, value]) => {
        params.append(key, value ?? "");
      });

      response = await fetch(BASE_URL, {
        method: "POST",
        body: params
      });
    }

    const data = await response.text();
    res.status(200).send(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro no proxy" });
  }
}