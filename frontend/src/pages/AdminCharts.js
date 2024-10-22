import React from 'react';
import AdminGarbageChart from '../components/AdminGarbageChart';
import AssignedCollectorChart from '../components/AssignedCollectorChart';
import MonthlyRequestsChart from '../components/MonthlyRequestsChart';
import GarbageCategoryChart from '../components/GarbageCategoryChart';
import '../styles/AdminCharts.css'; // Import the CSS file

const AdminCharts = () => {
  return (
    <div className="admin-charts-container">
      <h2 className="admin-charts-header">Admin Charts</h2>

      {/* Old Garbage Data by Category */}
      <div className="chart-section">
        <AdminGarbageChart />
      </div>

      {/* New Chart for Garbage Collectors and Users */}
      <div className="chart-section">
        <AssignedCollectorChart />
      </div>

      {/* Two Charts Side by Side: MonthlyRequestsChart and GarbageCategoryChart */}
      <div className="side-by-side-charts">
        {/* Number of Requests per Month */}
        <div className="chart-container">
          <MonthlyRequestsChart />
        </div>

        {/* Garbage Category Chart (Most Requested Categories) */}
        <div className="chart-container">
          <GarbageCategoryChart />
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
