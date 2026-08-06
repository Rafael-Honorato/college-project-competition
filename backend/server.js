require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc"); // ← NOVO
const swaggerUi = require("swagger-ui-express"); // ← NOVO

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ CONFIGURAÇÃO DO SWAGGER
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tutoriais",
      version: "1.0.0",
      description: `Backend genérico para tutoriais. Módulo ativo: ${process.env.TUTORIAL || "todo-list"}`,
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [`./tutoriais/${process.env.TUTORIAL || todo - list}.js`], // ← Lê os comentários JSDoc dos módulos
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Banco compartilhado
const db = new Database("./database.db");

// Carrega módulo do tutorial
const tutorialName = process.env.TUTORIAL || "todo-list";
const tutorialPath = path.join(__dirname, "tutoriais", `${tutorialName}.js`);

try {
  const registerTutorial = require(tutorialPath);
  registerTutorial(app, db);
  console.log(`📚 Tutorial carregado: ${tutorialName}`);
} catch (err) {
  console.error(`❌ Erro ao carregar tutorial "${tutorialName}":`, err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Backend: http://localhost:${PORT}`);
  console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`); // ← NOVO
});
