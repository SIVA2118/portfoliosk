import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageEducation = () => {
    const { token } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        year: '',
        title: '',
        institution: '',
        desc: '',
        type: 'education',
        order: 0
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchEntries = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/education`);
            const data = await response.json();
            if (data.success) setEntries(data.data);
        } catch (error) {
            console.error('Error fetching education:', error);
            setMessage('Failed to load education entries.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleChange = (e) => {
        const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/education/${editingId}` : `${API_BASE_URL}/education`;

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
                setMessage(`Entry ${editingId ? 'updated' : 'added'} successfully!`);
                setFormData({ year: '', title: '', institution: '', desc: '', type: 'education', order: 0 });
                setEditingId(null);
                fetchEntries();
            }
        } catch (error) {
            setMessage('Error saving entry.');
        }
    };

    const handleEdit = (entry) => {
        setEditingId(entry._id);
        setFormData({ ...entry });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/education/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchEntries();
                setMessage('Entry deleted.');
            }
        } catch (error) {
            setMessage('Error deleting entry.');
        }
    };

    if (loading) return <div>Loading Education & Experience...</div>;

    return (
        <div className="manage-section">
            <h2>Manage Education & Experience</h2>
            {message && <div className="status-message">{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Year Range</label>
                        <input name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 2019 - 2022" required />
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Institution / Company</label>
                        <input name="institution" value={formData.institution} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="education">Education</option>
                            <option value="experience">Experience</option>
                        </select>
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
                    <button type="submit" className="save-btn">{editingId ? 'Update Entry' : 'Add Entry'}</button>
                    {editingId && <button type="button" className="cancel-btn" onClick={() => { setEditingId(null); setFormData({ year: '', title: '', institution: '', desc: '', type: 'education', order: 0 }); }}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                <h3>Current Entries</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map(e => (
                            <tr key={e._id}>
                                <td>{e.year}</td>
                                <td>{e.title}</td>
                                <td style={{ textTransform: 'capitalize' }}>{e.type}</td>
                                <td>
                                    <button className="edit-mini" onClick={() => handleEdit(e)}>Edit</button>
                                    <button className="delete-mini" onClick={() => handleDelete(e._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageEducation;
