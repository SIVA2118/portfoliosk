import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageSkills = () => {
    const { token } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        level: 80,
        icon: '',
        order: 0
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchSkills = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/skills`);
            const data = await response.json();
            if (data.success) setSkills(data.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
            setMessage('Failed to load skills.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleChange = (e) => {
        const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/skills/${editingId}` : `${API_BASE_URL}/skills`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setMessage(`Skill ${editingId ? 'updated' : 'added'} successfully!`);
                setFormData({ name: '', level: 80, icon: '', order: 0 });
                setEditingId(null);
                fetchSkills();
            }
        } catch (error) {
            setMessage('Error saving skill.');
        }
    };

    const handleEdit = (s) => {
        setEditingId(s._id);
        setFormData({ ...s });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchSkills();
                setMessage('Skill deleted.');
            }
        } catch (error) {
            setMessage('Error deleting skill.');
        }
    };

    if (loading) return <div>Loading Skills...</div>;

    return (
        <div className="manage-section">
            <h2>Manage Skills</h2>
            {message && <div className="status-message">{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Skill Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Knowledge Level (%)</label>
                        <input type="number" name="level" value={formData.level} onChange={handleChange} min="0" max="100" />
                    </div>
                    <div className="form-group">
                        <label>Icon URL (e.g. /icons/react.png)</label>
                        <input name="icon" value={formData.icon} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Display Order</label>
                        <input type="number" name="order" value={formData.order} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-btn">{editingId ? 'Update Skill' : 'Add Skill'}</button>
                    {editingId && <button type="button" className="cancel-btn" onClick={() => { setEditingId(null); setFormData({ name: '', level: 80, icon: '', order: 0 }); }}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                <h3>Current Skills</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map(s => (
                            <tr key={s._id}>
                                <td>{s.name}</td>
                                <td>{s.level}%</td>
                                <td>
                                    <button className="edit-mini" onClick={() => handleEdit(s)}>Edit</button>
                                    <button className="delete-mini" onClick={() => handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageSkills;
