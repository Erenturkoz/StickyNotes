import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import ArchiveModal from '../components/ArchiveModal';
import '../Css/Todo.css';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState({ header: "", details: "" });
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('/api/todos', config);
            const activeTodos = response.data.filter(todo => todo.check === false);

            setTodos(activeTodos);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            const response = await axios.put(`/api/todos/${id}`, { check: false }, config);
            setTodos(prev => [...prev, response.data]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/todos', newNote, config);
            setTodos([...todos, response.data]);
            setNewNote({ header: "", details: "" });
            setIsAdding(false);
        } catch (err) {
            alert("Hata oluştu");
        }
    };

    const handleCheck = async (id) => {
        try {
            const targetTodo = todos.find(t => t._id === id);

            const response = await axios.put(`/api/todos/${id}`, {
                check: !targetTodo.check
            }, config);

            setTodos(todos.map(t => t._id === id ? response.data : t));

            if (!targetTodo.check) {
                setTimeout(() => {
                    setTodos(prev => prev.filter(t => t._id !== id));
                }, 1500);
            }

        } catch (err) {
            console.error("Check hatası:", err);
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/todos/${id}`, config);
        setTodos(todos.filter(t => t._id !== id));
    };

    const handleDragStop = async (id, e, data) => {
        try {
            await axios.put(`/api/todos/${id}`, {
                position: { x: data.x, y: data.y }
            }, config);
        } catch (err) {
            console.error("Konum kaydedilemedi:", err);
        }
    };

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div className="min-h-screen board-container">

            <div className="archive-box" onClick={() => setIsArchiveOpen(true)}>
                <span>📦</span>
                <small>ARŞİV</small>
            </div>

            <div className="add-note-wrapper">
                {!isAdding ? (
                    <button className="add-toggle-btn" onClick={() => setIsAdding(true)}>
                        +
                    </button>
                ) : (
                    <form onSubmit={handleAddTodo} className="note-form">
                        <input
                            placeholder="Başlık"
                            className="note-input"
                            value={newNote.header}
                            onChange={e => setNewNote({ ...newNote, header: e.target.value })}
                        />
                        <textarea
                            placeholder="Detaylar..."
                            className="note-input note-textarea"
                            value={newNote.details}
                            onChange={e => setNewNote({ ...newNote, details: e.target.value })}
                        />
                        <div className="form-actions">
                            <button type="submit" className="form-btn submit-btn">Ekle</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="form-btn cancel-btn">İptal</button>
                        </div>
                    </form>
                )}
            </div>

            {/* EKRANDAKİ NOTLAR */}
            {todos.map((todo) => {
                const nodeRef = React.createRef();
                return (
                    <Draggable
                        key={todo._id}
                        nodeRef={nodeRef}
                        bounds="parent"
                        handle=".drag-handle"
                        defaultPosition={{
                            x: Number(todo.position?.x) || 0,
                            y: Number(todo.position?.y) || 0
                        }}
                        onStop={(e, data) => handleDragStop(todo._id, e, data)}
                    >
                        <div ref={nodeRef} className={`todo-note ${todo.check ? 'completed' : ''}`}>

                            <div className="drag-handle">
                                📌 {todo.header}
                            </div>

                            <div className={`note-details ${todo.check ? 'text-completed' : ''}`}>
                                {todo.details}
                            </div>

                            <div className="note-footer">
                                <input
                                    type="checkbox"
                                    className="check-input"
                                    checked={todo.check}
                                    onChange={() => handleCheck(todo._id)}
                                />
                                <button onClick={() => handleDelete(todo._id)} className="delete-btn">Sil</button>
                            </div>

                        </div>
                    </Draggable>
                );
            })}

            <ArchiveModal
                isOpen={isArchiveOpen}
                onClose={() => setIsArchiveOpen(false)}
                onRestore={handleRestore}
                config={config}
            />

        </div>
    );
};

export default Todo;