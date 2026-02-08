import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageAbout = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        degree: '',
        phone: '',
        email: '',
        address: '',
        freelance: '',
        bio: '',
        homeDescription: '',
        roles: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchAbout = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/about`);
            const data = await response.json();
            if (data.success && data.data) {
                const about = data.data;
                setFormData({
                    ...about,
                    roles: about.roles ? about.roles.join(', ') : ''
                });
            }
        } catch (error) {
            console.error('Error fetching about:', error);
            setMessage('Failed to load About data.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchAbout();
    }, [fetchAbout]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataPayload = new FormData();
        formDataPayload.append('file', file);

        setUploading(true);
        setMessage('Uploading resume...');

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataPayload
            });

            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, resumeLink: data.data }));
                setMessage('Resume uploaded successfully! Click save to update.');
            } else {
                setMessage('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Network error during upload.');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const submitData = {
            ...formData,
            roles: formData.roles.split(',').map(role => role.trim())
        };

        try {
            const response = await fetch(`${API_BASE_URL}/about`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();
            if (data.success) {
                setMessage('About section updated successfully!');
            } else {
                setMessage('Error: ' + data.error);
            }
        } catch (error) {
            setMessage('Network error updating about.');
        }
    };

    if (loading) return <div>Loading About Data...</div>;

    return (
        <div className="manage-section">
            <h2>Manage About Section</h2>
            {message && <div className="status-message">{message}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Degree</label>
                        <input name="degree" value={formData.degree} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Freelance Status</label>
                        <input name="freelance" value={formData.freelance} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Roles (comma separated)</label>
                    <input name="roles" value={formData.roles} onChange={handleChange} placeholder="e.g. Developer, Designer" />
                </div>

                <div className="form-group">
                    <label>Home Hero Description</label>
                    <textarea name="homeDescription" value={formData.homeDescription} onChange={handleChange} rows="3" />
                </div>

                <div className="form-group">
                    <label>Biography</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows="6" required />
                </div>

                <div className="form-group">
                    <label>Resume PDF Upload</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        {uploading && <span>Uploading...</span>}
                    </div>
                    {formData.resumeLink && (
                        <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#888' }}>
                            Current Resume: <a href={formData.resumeLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>View File</a>
                        </p>
                    )}
                </div>

                <button type="submit" className="save-btn" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default ManageAbout;
