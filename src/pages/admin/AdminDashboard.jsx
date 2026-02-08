import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ManageAbout from './ManageAbout';
import ManageProjects from './ManageProjects';
import ManageSkills from './ManageSkills';
import ManageServices from './ManageServices';
import ManageYoutube from './ManageYoutube';
import ManageEducation from './ManageEducation';
import ManageMessages from './ManageMessages';
import { API_BASE_URL } from '../../apiConfig';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { logout, token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        services: 0,
        messages: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            setLoadingStats(true);
            try {
                // Fetch public counts with individual error handling
                const fetchSafe = async (url, options = {}) => {
                    try {
                        const res = await fetch(url, options);
                        if (!res.ok) return { success: false, data: [] };
                        return await res.json();
                    } catch (e) {
                        console.error(`Fetch failed for ${url}:`, e);
                        return { success: false, data: [] };
                    }
                };

                const [pData, sData, svData, mData] = await Promise.all([
                    fetchSafe(`${API_BASE_URL}/projects`),
                    fetchSafe(`${API_BASE_URL}/skills`),
                    fetchSafe(`${API_BASE_URL}/services`),
                    fetchSafe(`${API_BASE_URL}/contact`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setStats({
                    projects: pData.success && Array.isArray(pData.data) ? pData.data.length : 0,
                    skills: sData.success && Array.isArray(sData.data) ? sData.data.length : 0,
                    services: svData.success && Array.isArray(svData.data) ? svData.data.length : 0,
                    messages: mData.success && Array.isArray(mData.data) ? mData.data.length : 0
                });
            } catch (err) {
                console.error('Critical error in dashboard stats loop:', err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [token, API_BASE_URL, location.pathname]); // Refresh when switching tabs

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const isActive = (path) => {
        if (path === '/admin/dashboard') {
            return location.pathname === path || location.pathname === path + '/';
        }
        return location.pathname === path;
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-dashboard">
            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

            <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                    <button className="close-sidebar-btn" onClick={closeSidebar}>×</button>
                </div>
                <nav>
                    <ul>
                        <li className={isActive('/admin/dashboard') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard">Overview</Link>
                        </li>
                        <li className={isActive('/admin/dashboard/messages') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/messages">
                                Manage Messages {stats.messages > 0 && <span className="msg-count-badge">{stats.messages}</span>}
                            </Link>
                        </li>
                        <li className={isActive('/admin/dashboard/about') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/about">Manage About</Link>
                        </li>
                        <li className={isActive('/admin/dashboard/education') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/education">Manage Education</Link>
                        </li>
                        <li className={isActive('/admin/dashboard/projects') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/projects">Manage Projects</Link>
                        </li>
                        <li className={isActive('/admin/dashboard/skills') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/skills">Manage Skills</Link>
                        </li>
                        <li className={isActive('/admin/dashboard/services') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/services">Manage Services</Link>
                        </li>
                        <li className={isActive('/admin/dashboard/youtube') ? 'active' : ''} onClick={closeSidebar}>
                            <Link to="/admin/dashboard/youtube">Manage YouTube</Link>
                        </li>
                    </ul>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </aside>
            <main className="admin-main" data-lenis-prevent>
                <Routes>
                    <Route path="/" element={
                        <div className="overview-tab">
                            <header>
                                <h1>Welcome, Admin</h1>
                            </header>
                            <section className="dashboard-content">
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h3>Total Projects</h3>
                                        <p>{loadingStats ? '...' : stats.projects}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Total Skills</h3>
                                        <p>{loadingStats ? '...' : stats.skills}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Inquiries</h3>
                                        <p>{loadingStats ? '...' : stats.messages}</p>
                                    </div>
                                </div>
                                <div className="recent-activity">
                                    <h2>Dashboard Status</h2>
                                    <div className={`status-indicator ${stats.projects === 0 && stats.skills === 0 && !loadingStats ? 'warning' : 'operational'}`}>
                                        <span className="dot"></span>
                                        {stats.projects === 0 && stats.skills === 0 && !loadingStats
                                            ? 'Potential API connection issue or empty data.'
                                            : 'All modules are currently operational and connected.'}
                                    </div>
                                    <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#888' }}>
                                        Last Sync: {new Date().toLocaleTimeString()}
                                    </p>
                                </div>
                            </section>
                        </div>
                    } />
                    <Route path="/about" element={<ManageAbout />} />
                    <Route path="/education" element={<ManageEducation />} />
                    <Route path="/projects" element={<ManageProjects />} />
                    <Route path="/skills" element={<ManageSkills />} />
                    <Route path="/services" element={<ManageServices />} />
                    <Route path="/youtube" element={<ManageYoutube />} />
                    <Route path="/messages" element={<ManageMessages />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
