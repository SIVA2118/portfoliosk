import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageProjects = () => {
    const { token } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        image: '',
        link: '',
        order: 0
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            const data = await response.json();
            if (data.success) setProjects(data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/projects/${editingId}` : `${API_BASE_URL}/projects`;

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
                setMessage(`Project ${editingId ? 'updated' : 'added'} successfully!`);
                setFormData({ title: '', category: '', description: '', image: '', link: '', order: 0 });
                setEditingId(null);
                fetchProjects();
            } else {
                setMessage(data.error || `Failed to ${editingId ? 'update' : 'add'} project.`);
            }
        } catch (error) {
            setMessage('Network error while saving project.');
        }
    };

    const handleEdit = (p) => {
        setEditingId(p._id);
        setFormData({ ...p });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchProjects();
                setMessage('Project deleted.');
            }
        } catch (error) {
            setMessage('Error deleting project.');
        }
    };

    if (loading) return <div>Loading Projects...</div>;

    return (
        <div className="manage-section">
            <h2>Manage Projects</h2>
            {message && <div className="status-message">{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="image" value={formData.image} onChange={handleChange} placeholder="/images/project.png" required />
                    </div>
                    <div className="form-group">
                        <label>Project Link</label>
                        <input name="link" value={formData.link} onChange={handleChange} placeholder="https://github.com/..." />
                    </div>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-btn">{editingId ? 'Update Project' : 'Add Project'}</button>
                    {editingId && <button type="button" className="cancel-btn" onClick={() => { setEditingId(null); setFormData({ title: '', category: '', description: '', image: '', link: '', order: 0 }); }}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                <h3>Current Projects</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(p => (
                            <tr key={p._id}>
                                <td>{p.title}</td>
                                <td>{p.category}</td>
                                <td>
                                    <button className="edit-mini" onClick={() => handleEdit(p)}>Edit</button>
                                    <button className="delete-mini" onClick={() => handleDelete(p._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProjects;
