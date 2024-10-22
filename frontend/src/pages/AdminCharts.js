// pages/AdminCharts.js

import React from 'react';
import AdminGarbageChart from '../components/AdminGarbageChart'; // Import the garbage chart component
import AssignedCollectorChart from '../components/AssignedCollectorChart'; // Import the new chart component

const AdminCharts = () => {
  return (
    <div>
      <h2>Admin Charts</h2>

      {/* Old Garbage Data by Category */}
      <div style={{ marginTop: '20px' }}>
        <AdminGarbageChart />
      </div>

      {/* New Chart for Garbage Collectors and Users */}
      <div style={{ marginTop: '40px' }}>
        <AssignedCollectorChart />
      </div>
    </div>
  );
};

export default AdminCharts;
