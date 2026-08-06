const crypto = require("crypto");

/**
 * Tutorial: College Project Competition App (Angular 19)
 * Replica a API projectapi.com usada no vídeo Oz1_IxcKeG8
 *
 * Rotas:
 *   POST   /api/User/Register
 *   POST   /api/User/Login
 *   GET    /api/User/GetAllUser
 *   POST   /api/Competition/Create
 *   GET    /api/Competition/GetAll
 *   GET    /api/Competition/GetById
 *   POST   /api/Project/Submit
 *   GET    /api/Project/GetByCompetition
 */
module.exports = function registerCollegeCompetition(app, db) {
  // ============ SCHEMA ============
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      userId INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      collegeName TEXT,
      role TEXT DEFAULT 'student',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS competitions (
      competitionId INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      startDate TEXT,
      endDate TEXT,
      status TEXT DEFAULT 'new',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      projectId INTEGER PRIMARY KEY AUTOINCREMENT,
      competitionId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      projectTitle TEXT NOT NULL,
      description TEXT,
      submissionDate TEXT,
      githubUrl TEXT,
      rank INTEGER,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Login hardcoded do college (organizador), como mencionado no vídeo
    INSERT OR IGNORE INTO users (userId, fullName, email, password, collegeName, role)
    VALUES (1, 'College Admin', 'admin@thegmail.com', '${hashPassword("admin")}', 'Main College', 'admin');
  `);

  // ============ HELPERS ============
  function hashPassword(pwd) {
    return crypto.createHash("sha256").update(String(pwd)).digest("hex");
  }

  function toUserResponse(u) {
    if (!u) return null;
    return {
      userId: u.userId,
      fullName: u.fullName,
      email: u.email,
      collegeName: u.collegeName,
      role: u.role,
    };
  }

  // ============ USER ============

  /**
   * @swagger
   * /api/User/Register:
   *   post:
   *     summary: Registra um novo estudante
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullName: { type: string }
   *               email: { type: string }
   *               password: { type: string }
   *               collegeName: { type: string }
   *     responses:
   *       201:
   *         description: Usuário registrado com sucesso
   */
  app.post("/api/User/Register", (req, res) => {
    const { fullName, email, password, collegeName } = req.body || {};
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "fullName, email e password são obrigatórios" });
    }
    try {
      const stmt = db.prepare(
        `INSERT INTO users (fullName, email, password, collegeName, role)
         VALUES (?, ?, ?, ?, 'student')`,
      );
      const result = stmt.run(
        fullName,
        email,
        hashPassword(password),
        collegeName || null,
      );
      const user = db
        .prepare("SELECT * FROM users WHERE userId = ?")
        .get(result.lastInsertRowid);
      res.status(201).json({
        message: "User registered successfully",
        user: toUserResponse(user),
      });
    } catch (err) {
      if (String(err.message).includes("UNIQUE")) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }
      res.status(500).json({ message: err.message });
    }
  });

  /**
   * @swagger
   * /api/User/Login:
   *   post:
   *     summary: Autentica um usuário
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Login bem-sucedido
   *       401:
   *         description: Credenciais inválidas
   */
  app.post("/api/User/Login", (req, res) => {
    const { email, password } = req.body || {};
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json(toUserResponse(user));
  });

  /**
   * @swagger
   * /api/User/GetAllUser:
   *   get:
   *     summary: Lista todos os usuários
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Array de usuários
   */
  app.get("/api/User/GetAllUser", (req, res) => {
    const users = db.prepare("SELECT * FROM users ORDER BY userId").all();
    res.json(users.map(toUserResponse));
  });

  // ============ COMPETITION ============

  /**
   * @swagger
   * /api/Competition/Create:
   *   post:
   *     summary: Cria uma nova competição
   *     tags: [Competition]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title: { type: string }
   *               description: { type: string }
   *               startDate: { type: string }
   *               endDate: { type: string }
   *               status: { type: string }
   *     responses:
   *       201:
   *         description: Competição criada
   */
  app.post("/api/Competition/Create", (req, res) => {
    const {
      title,
      description,
      startDate,
      endDate,
      status = "new",
    } = req.body || {};
    if (!title) return res.status(400).json({ message: "title é obrigatório" });
    const result = db
      .prepare(
        `INSERT INTO competitions (title, description, startDate, endDate, status)
       VALUES (?, ?, ?, ?, ?)`,
      )
      .run(title, description || "", startDate || "", endDate || "", status);
    const comp = db
      .prepare("SELECT * FROM competitions WHERE competitionId = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(comp);
  });

  /**
   * @swagger
   * /api/Competition/GetAll:
   *   get:
   *     summary: Lista todas as competições
   *     tags: [Competition]
   *     responses:
   *       200:
   *         description: Array de competições
   */
  app.get("/api/Competition/GetAll", (req, res) => {
    const list = db
      .prepare("SELECT * FROM competitions ORDER BY competitionId DESC")
      .all();
    res.json(list);
  });

  /**
   * @swagger
   * /api/Competition/GetById:
   *   get:
   *     summary: Obtém uma competição pelo ID
   *     tags: [Competition]
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Detalhe da competição
   */
  app.get("/api/Competition/GetById", (req, res) => {
    const id = req.query.id;
    const comp = db
      .prepare("SELECT * FROM competitions WHERE competitionId = ?")
      .get(id);
    if (!comp)
      return res.status(404).json({ message: "Competition not found" });
    res.json(comp);
  });

  // ============ PROJECT ============

  /**
   * @swagger
   * /api/Project/Submit:
   *   post:
   *     summary: Submete um projeto a uma competição
   *     tags: [Project]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               competitionId: { type: integer }
   *               userId: { type: integer }
   *               projectTitle: { type: string }
   *               description: { type: string }
   *               submissionDate: { type: string }
   *               githubUrl: { type: string }
   *     responses:
   *       201:
   *         description: Projeto submetido
   */
  app.post("/api/Project/Submit", (req, res) => {
    const {
      competitionId,
      userId,
      projectTitle,
      description,
      submissionDate,
      githubUrl,
    } = req.body || {};
    if (!competitionId || !userId || !projectTitle) {
      return res.status(400).json({
        message: "competitionId, userId e projectTitle são obrigatórios",
      });
    }
    const result = db
      .prepare(
        `INSERT INTO projects (competitionId, userId, projectTitle, description, submissionDate, githubUrl)
       VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        competitionId,
        userId,
        projectTitle,
        description || "",
        submissionDate || "",
        githubUrl || "",
      );
    const proj = db
      .prepare("SELECT * FROM projects WHERE projectId = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(proj);
  });

  /**
   * @swagger
   * /api/Project/GetByCompetition:
   *   get:
   *     summary: Lista submissões de uma competição
   *     tags: [Project]
   *     parameters:
   *       - in: query
   *         name: competitionId
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Array de projetos submetidos
   */
  app.get("/api/Project/GetByCompetition", (req, res) => {
    const competitionId = req.query.competitionId;
    const list = db
      .prepare(
        `SELECT p.*, u.fullName AS studentName, u.email AS studentEmail
       FROM projects p
       LEFT JOIN users u ON u.userId = p.userId
       WHERE p.competitionId = ?
       ORDER BY p.projectId DESC`,
      )
      .all(competitionId);
    res.json(list);
  });

  console.log("   ✅ Rotas User, Competition e Project registradas");
  console.log("   🔐 Login college padrão: admin@thegmail.com / admin");
};
