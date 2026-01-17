import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs/promises';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = "gemini-1.5-flash"; 
const signName = "Aries"; 

// Esto nos dirá en el log de GitHub si la clave está llegando o no
if (!apiKey) {
  console.error("❌ ERROR: La variable GEMINI_API_KEY llega vacía al script.");
  process.exit(1); 
} else {
  console.log("✅ La clave API se ha detectado correctamente.");
}

const ai = new GoogleGenAI(apiKey);

async function generateHoroscope() {
  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const prompt = `Genera el horóscopo diario para el signo ${signName}. Solo el texto, máximo 100 palabras.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error en Gemini:", error);
    return "No se pudo cargar el horóscopo hoy.";
  }
}

async function updateIndexHtml() {
  const newHoroscope = await generateHoroscope();
  const date = new Date().toLocaleDateString('es-ES', { dateStyle: 'long' });

  const newContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Horóscopo Aries</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; background: #f0f2f5; }
        .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 500px; margin: auto; }
        h1 { color: #ff4757; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Aries ♈</h1>
        <p><strong>${date}</strong></p>
        <p>${newHoroscope}</p>
    </div>
</body>
</html>`;

  await fs.writeFile('index.html', newContent);
  console.log('✅ Archivo index.html actualizado.');
}

updateIndexHtml();
