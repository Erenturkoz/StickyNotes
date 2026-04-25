import express from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../models/TodoList.js";
import { authMiddleware } from "../middleware/auth.js"; // Giriş kontrolü yapan middleware

const router = express.Router();
router.use(authMiddleware);

// POST: /api/todos
router.post("/", createTodo);
router.get("/", getTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;