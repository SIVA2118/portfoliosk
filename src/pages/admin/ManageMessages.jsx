import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

const ManageMessages = () => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState('');

    const fetchMessages = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setStatusMsg(''); // Reset error message on retry
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
            } else {
                setStatusMsg(data.error || 'Failed to fetch messages.');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setStatusMsg('Network error. Could not load messages.');
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.filter(m => m._id !== id));
                setStatusMsg('Message deleted.');
            }
        } catch (error) {
            setStatusMsg('Error deleting message.');
        }
    };

    if (loading) return <div className="loading-state">Loading Messages...</div>;

    return (
        <div className="manage-section">
            <h2>Contact Inquiries</h2>
            <div className="admin-list messages-list">
                {statusMsg && !loading && messages.length === 0 ? (
                    <div className="error-retry-box">
                        <p className="error-text">{statusMsg}</p>
                        <button onClick={fetchMessages} className="save-btn" style={{ marginTop: '10px' }}>Retry Connection</button>
                    </div>
                ) : messages.length === 0 && !loading ? (
                    <p className="empty-msg">No messages received yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(m => (
                                <tr key={m._id}>
                                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <strong>{m.name}</strong><br />
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{m.email}</span>
                                    </td>
                                    <td>{m.subject}</td>
                                    <td className="msg-preview">{m.message}</td>
                                    <td>
                                        <button className="delete-mini" onClick={() => handleDelete(m._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageMessages;
