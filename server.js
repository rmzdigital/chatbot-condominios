const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const CONDOMINIOS = {
  "riviere": "riviere.pdf",
  "rivière": "riviere.pdf",
  "absoluto home design": "absoluto.pdf",
  "carrara": "carrara.pdf",
  "contemporâneo": "contemporaneo.pdf",
  "dunas do leste": "dunas.pdf",
  "encantos do mar": "encantos.pdf",
  "essence": "essence.pdf",
  "iconic": "iconic.pdf",
  "infiniti": "infiniti.pdf",
  "la plage": "la_plage.pdf",
  "las piedras": "las_piedras.pdf",
  "las rozas": "las_rozas.pdf",
  "malibu": "malibu.pdf",
  "mar aberto": "mar_aberto.pdf",
  "moana": "moana.pdf",
  "palm beach": "palm_beach.pdf",
  "quinta dos açores": "quinta.pdf",
  "riozinho style": "riozinho.pdf",
  "saint exupery": "saint_exupery.pdf",
  "sunclub": "sunclub.pdf",
  "sunset": "sunset.pdf",
  "swami": "swami.pdf",
  "thai beach": "thai_beach.pdf"
};

app.post("/webhook", async (req, res) => {
  const { condominio, pergunta } = req.body;
  const arquivoPDF = CONDOMINIOS[condominio.toLowerCase()];

  if (!arquivoPDF) {
    return res.json({ resposta: "Condomínio não encontrado." });
  }

  try {
    const dataBuffer = fs.readFileSync(`./pdfs/${arquivoPDF}`);
    const data = await pdfParse(dataBuffer);

    const resposta = data.text.includes(pergunta)
      ? "Encontrei algo sobre isso no PDF."
      : "Não encontrei essa informação no PDF.";

    res.json({ resposta });
  } catch (error) {
    res.json({ resposta: "Erro ao processar o PDF." });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
