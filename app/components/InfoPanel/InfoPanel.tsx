import React from 'react';
import { Calendar } from 'lucide-react';
import './InfoPanel.scss';

const InfoPanel: React.FC = () => {
  return (
    <div className="info-panel">
      <div className="info-content">
        <Calendar size={48} className="icon-logo" />
        <h1>Queue Booking System</h1>
        <p>Streamline your appointments and manage queues efficiently with our modern booking platform.</p>

        <ul className="feature-list">
          <li className="feature-item">Easy online queue booking</li>
          <li className="feature-item">Real-time queue status</li>
          <li className="feature-item">Instant notifications</li>
          <li className="feature-item">Manage multiple appointments</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoPanel;