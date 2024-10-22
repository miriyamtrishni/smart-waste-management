import React from 'react';
import AdminGarbageChart from '../components/AdminGarbageChart'; // Import the garbage chart component
import AssignedCollectorChart from '../components/AssignedCollectorChart'; // Import the assigned collector chart component
import MonthlyRequestsChart from '../components/MonthlyRequestsChart'; // Import the monthly requests chart component
import GarbageCategoryChart from '../components/GarbageCategoryChart'; // Import the garbage category chart component

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

      {/* Two Charts Side by Side: MonthlyRequestsChart and GarbageCategoryChart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        {/* Number of Requests per Month */}
        <div style={{ width: '48%' }}>
          <MonthlyRequestsChart />
        </div>

        {/* Garbage Category Chart (Most Requested Categories) */}
        <div style={{ width: '48%' }}>
          <GarbageCategoryChart />
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
