import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Line } from 'react-chartjs-2';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!stats) return <div className="container mt-5">Loading...</div>;

  const chartData = {
    labels: stats.revenue.labels,
    datasets: [{
      label: 'Revenue (₦)',
      data: stats.revenue.data,
      fill: true,
      backgroundColor: 'rgba(13,110,253,0.1)',
      borderColor: 'rgba(13,110,253,1)'
    }]
  };

  return (
    <div className="container-fluid">
      <div className="row my-4">
        <div className="col-3">
          <div className="card p-3">
            <h5>Total Interns</h5>
            <h3>{stats.totalInterns}</h3>
          </div>
        </div>
        <div className="col-3">
          <div className="card p-3">
            <h5>Active Interns</h5>
            <h3>{stats.activeInterns}</h3>
          </div>
        </div>
        <div className="col-3">
          <div className="card p-3">
            <h5>Monthly Revenue</h5>
            <h3>₦{stats.monthlyRevenue}</h3>
          </div>
        </div>
        <div className="col-3">
          <div className="card p-3">
            <h5>Certificates Approved</h5>
            <h3>{stats.certificatesApproved}</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-8">
          <div className="card p-3">
            <h5>Revenue (last 12 months)</h5>
            <Line data={chartData} />
          </div>
        </div>
        <div className="col-4">
          <div className="card p-3">
            <h5>Recent Activities</h5>
            <ul className="list-group">
              {stats.recentActivities.map((a:any) => (
                <li key={a.id} className="list-group-item">{a.action} — <small>{new Date(a.createdAt).toLocaleString()}</small></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
