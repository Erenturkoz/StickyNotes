import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    header: {
        type: String,
        required: [true, "Başlık alanı zorunludur"],
        trim: true,
    },
    details: {
        type: String,
        required: false,
        trim: true
    },
    check: {
        type: Boolean,
        default: false,
    },
    position: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 100 }
    },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// POST /api/todos
const createTodo = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Yetkisiz erişim: Kullanıcı ID bulunamadı." });
        }

        const newTodo = new Todo({
            header: req.body.header,
            details: req.body.details,
            userId: req.user.id
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Bu başlık zaten mevcut." });
        }
        res.status(500).json(err);
    }
};

// GET /api/todos
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: "Veriler çekilirken bir hata oluştu", error: err.message });
    }
};

// PUT /api/todos/:id 
const updateTodo = async (req, res) => {
    try {
        const { check, position } = req.body;
        const updateData = {};

        if (check !== undefined) updateData.check = check;
        if (position) updateData.position = position;

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!updatedTodo) return res.status(404).json({ message: "Bulunamadı" });
        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!deletedTodo) {
            return res.status(404).json({ message: "Görev bulunamadı veya yetkiniz yok." });
        }

        res.status(200).json({ message: "Görev başarıyla silindi." });
    } catch (err) {
        res.status(500).json(err);
    }
};

export { createTodo, getTodos, deleteTodo, updateTodo };