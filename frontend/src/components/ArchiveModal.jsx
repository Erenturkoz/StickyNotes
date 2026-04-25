import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Archive.css';

const ArchiveModal = ({ isOpen, onClose, onRestore, config }) => {
    const [archivedTodos, setArchivedTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchArchived();
        }
    }, [isOpen]);

    const fetchArchived = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/todos', config);
            const completed = response.data.filter(t => t.check === true);
            setArchivedTodos(completed);
        } catch (err) {
            console.error("Arşiv yüklenirken hata:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreClick = async (id) => {
        await onRestore(id); // Üst bileşendeki uncheck işlemini çağırır
        setArchivedTodos(archivedTodos.filter(t => t._id !== id)); // Listeden anında kaldır
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📦 Arşivlenmiş Notlar</h3>
                    <button className="close-btn" onClick={onClose}>X</button>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Yükleniyor...</p>
                ) : (
                    <ul className="archive-list">
                        {archivedTodos.length > 0 ? (
                            archivedTodos.map(todo => (
                                <li key={todo._id} className="archive-item">
                                    <div className="archive-item-info">
                                        <span className="archive-item-header">{todo.header}</span>
                                    </div>
                                    <button
                                        className="restore-btn"
                                        onClick={() => handleRestoreClick(todo._id)}
                                    >
                                        Geri Al
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#95a5a6' }}>Arşivde not bulunamadı.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ArchiveModal;