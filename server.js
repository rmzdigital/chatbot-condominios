const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0/<537826976085281>/messages';
const TOKEN = '<EAATZBLs4npYYBO620NtxasPkQoze8dWL8fhddL5plg96zJi6EbKia5GSPb8GKtXZAWsO5cRyyQ8kZBgD9TZAZC0IQG26j7cBDKKJbzvoge6t0ZBbfZC1qPun5kCroZBuuRJq9KZCh1IUSbeN7yH1LQpDiDUoLl4S7rBeGQlO4cHycUi09vlNCWZCO1OvoIhKwmiSPB9KEZBZB7FOZBYkdL2ypK65SY2gbr0dd3iz8Spbg1FZCpdB0ZD>';

const userChoices = {};

const condominios = [
    "Absoluto Home Design", "Carrara", "Contemporâneo", "Dunas do Leste",
    "Encantos do Mar", "Essence", "Iconic", "Infiniti", "La Plage",
    "Las Piedras", "Las Rozas", "Malibu", "Mar Aberto", "Moana",
    "Palm Beach", "Quinta dos Açores", "Riozinho Style", "Riviere", "Rivière",
    "Saint Exupery", "Sunclub", "Sunset", "Swami", "Thai Beach", "Condomínio 24"
];

app.post('/webhook', async (req, res) => {
    const { messages } = req.body.entry[0].changes[0].value;

    if (messages) {
        const userMessage = messages[0].text.body.trim();
        const userPhone = messages[0].from;

        if (!userChoices[userPhone]) {
            await axios.post(WHATSAPP_API_URL, {
                messaging_product: "whatsapp",
                to: userPhone,
                text: { body: "Olá! Para começar, em qual condomínio você mora?" }
            }, { headers: { Authorization: `Bearer ${TOKEN}` } });

            userChoices[userPhone] = { stage: 'awaiting_condo' };
        } 
        else if (userChoices[userPhone].stage === 'awaiting_question') {
    const condoPdfPath = userChoices[userPhone].condo;
    
    exec(`python buscar_resposta.py "${condoPdfPath}" "${userMessage}"`, async (error, stdout, stderr) => {
        let resposta = stdout.trim() || "Desculpe, não encontrei essa informação.";
        
        await axios.post(WHATSAPP_API_URL, {
            messaging_product: "whatsapp",
            to: userPhone,
            text: { body: resposta }
        }, { headers: { Authorization: `Bearer ${TOKEN}` } });

        delete userChoices[userPhone];
    });
}