import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageYoutube = () => {
    const { token } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        link: '',
        thumbnail: '',
        order: 0
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/youtube`);
            const data = await response.json();
            if (data.success) setVideos(data.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/youtube/${editingId}` : `${API_BASE_URL}/youtube`;

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
                setMessage(`Video ${editingId ? 'updated' : 'added'} successfully!`);
                setFormData({ title: '', desc: '', link: '', thumbnail: '', order: 0 });
                setEditingId(null);
                fetchVideos();
            }
        } catch (error) {
            setMessage('Error saving video.');
        }
    };

    const handleEdit = (v) => {
        setEditingId(v._id);
        setFormData({ ...v });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/youtube/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                fetchVideos();
                setMessage('Video deleted.');
            }
        } catch (error) {
            setMessage('Error deleting video.');
        }
    };

    if (loading) return <div>Loading YouTube Data...</div>;

    return (
        <div className="manage-section">
            <h2>Manage YouTube Videos</h2>
            {message && <div className="status-message">{message}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Video Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Video Link</label>
                        <input name="link" value={formData.link} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Thumbnail URL</label>
                        <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
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
                    <button type="submit" className="save-btn">{editingId ? 'Update Video' : 'Add Video'}</button>
                    {editingId && <button type="button" className="cancel-btn" onClick={() => { setEditingId(null); setFormData({ title: '', desc: '', link: '', thumbnail: '', order: 0 }); }}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                <h3>Current Videos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map(v => (
                            <tr key={v._id}>
                                <td>{v.title}</td>
                                <td>
                                    <button className="edit-mini" onClick={() => handleEdit(v)}>Edit</button>
                                    <button className="delete-mini" onClick={() => handleDelete(v._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageYoutube;
