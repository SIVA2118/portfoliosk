import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageServices = () => {
    const { token } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        icon: '',
        desc: '',
        order: 0
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchServices = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/services`);
            const data = await response.json();
            if (data.success) setServices(data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            setMessage('Failed to load services.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleChange = (e) => {
        const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/services/${editingId}` : `${API_BASE_URL}/services`;

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
                setMessage(`Service ${editingId ? 'updated' : 'added'} successfully!`);
                setFormData({ title: '', icon: '', desc: '', order: 0 });
                setEditingId(null);
                fetchServices();
            }
        } catch (error) {
            setMessage('Error saving service.');
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
            const response = await fetch(`${API_BASE_URL}/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchServices();
                setMessage('Service deleted.');
            }
        } catch (error) {
            setMessage('Error deleting service.');
        }
    };

    if (loading) return <div>Loading Services...</div>;

    return (
        <div className="manage-section">
            <h2>Manage Services</h2>
            {message && <div className="status-message">{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Service Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Icon (Emoji or URL)</label>
                        <input name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g. 🎨" />
                    </div>
                    <div className="form-group">
                        <label>Display Order</label>
                        <input type="number" name="order" value={formData.order} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="desc" value={formData.desc} onChange={handleChange} rows="3" required />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-btn">{editingId ? 'Update Service' : 'Add Service'}</button>
                    {editingId && <button type="button" className="cancel-btn" onClick={() => { setEditingId(null); setFormData({ title: '', icon: '', desc: '', order: 0 }); }}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                <h3>Current Services</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(s => (
                            <tr key={s._id}>
                                <td>{s.title}</td>
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

export default ManageServices;
