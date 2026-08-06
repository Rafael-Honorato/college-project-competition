/**
 * Tutorial: Todo List
 * Rotas: /api/todos
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
