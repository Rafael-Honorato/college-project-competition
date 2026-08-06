require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Banco compartilhado
const db = new Database("./database.db");

// ✅ CARREGA O MÓDULO DO TUTORIAL VIA VARIÁVEL DE AMBIENTE
const tutorialName = process.env.TUTORIAL || "todo-list"; // padrão
const tutorialPath = path.join(__dirname, "tutorials", `${tutorialName}.js`);

try {
  const registerTutorial = require(tutorialPath);
  registerTutorial(app, db);
  console.log(`📚 Tutorial carregado: ${tutorialName}`);
} catch (err) {
  console.error(`❌ Erro ao carregar tutorial "${tutorialName}":`, err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`💾 Banco: ./database.db`);
});
