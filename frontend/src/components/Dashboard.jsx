import React from 'react';
import './dashboard.css';
import { useAuth } from '../context/auth/AuthContext';

const Dashboard = () => {
    const { current_user_details, logout } = useAuth(); // Destructure logout from useAuth
    console.log(current_user_details);

    // Check if services are present
    const hasService = (service) => current_user_details.services && current_user_details.services.includes(service);

    return (
        <div className="dashboard-container">
            <header>
                <h1>Dashboard Header</h1>
            </header>

            <aside>
                <div className="user-details">
                    <div className="avatar">
                        <img src="https://via.placeholder.com/200" alt="User Avatar" />
                    </div>
                    <div className="user-info">
                        <p className="user-name">{current_user_details.name}</p>
                        <p className="user-email">{current_user_details.email}</p>
                    </div>
                </div>

                <nav>
                    <ul>
                        <li><a href="#">Link 1</a></li>
                        <li><a href="#">Link 2</a></li>
                        <li><a href="#">Link 3</a></li>
                    </ul>
                </nav>

                <div className="logout">
                    <button className="logout-btn" onClick={logout}>Logout</button> {/* Add onClick handler */}
                </div>
            </aside>

            <main>
                <div>
                    <h1>
                        {hasService('accounts') ? 'Accounts' : <><i className="fas fa-lock"></i> Accounts</>}
                    </h1>
                </div>
                <div>
                    <h1>
                        {hasService('social_media') ? 'Social Media' : <><i className="fas fa-lock"></i> Social Media</>}
                    </h1>
                </div>
                <div>
                    <h1>
                        {hasService('human_resource') ? 'Human Resource' : <><i className="fas fa-lock"></i> Human Resource</>}
                    </h1>
                </div>
                <div>
                    <h1>
                        {hasService('legal') ? 'Legal' : <><i className="fas fa-lock"></i> Legal</>}
                    </h1>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
