/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Gerenciamento de tarefas
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Array de tarefas
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Atualiza uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa removida
 */
module.exports = function registerTodoList(app, db) {
  // Schema específico deste tutorial
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // GET
  app.get("/api/todos", (req, res) => {
    const todos = db
      .prepare("SELECT * FROM todos ORDER BY created_at DESC")
      .all();
    res.json(todos.map((t) => ({ ...t, completed: Boolean(t.completed) })));
  });

  // POST
  app.post("/api/todos", (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Título obrigatório" });

    const result = db
      .prepare("INSERT INTO todos (title) VALUES (?)")
      .run(title);
    const todo = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json({ ...todo, completed: Boolean(todo.completed) });
  });

  // PUT
  app.put("/api/todos/:id", (req, res) => {
    const { title, completed } = req.body;
    const existing = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Não encontrado" });

    const newTitle = title ?? existing.title;
    const newCompleted =
      completed !== undefined ? (completed ? 1 : 0) : existing.completed;

    db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?").run(
      newTitle,
      newCompleted,
      req.params.id,
    );

    const updated = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(req.params.id);
    res.json({ ...updated, completed: Boolean(updated.completed) });
  });

  // DELETE
  app.delete("/api/todos/:id", (req, res) => {
    const changes = db
      .prepare("DELETE FROM todos WHERE id = ?")
      .run(req.params.id).changes;
    if (!changes) return res.status(404).json({ error: "Não encontrado" });
    res.status(204).end();
  });
};
