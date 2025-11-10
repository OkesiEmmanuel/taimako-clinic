'use client';

import { Users, UserCog, CalendarDays } from 'lucide-react';
import DashboardCard from './components/DashboardCard';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Patients', value: 124, icon: Users, color: 'blue' },
    { title: 'Active Staff', value: 12, icon: UserCog, color: 'green' },
    { title: 'Appointments Today', value: 8, icon: CalendarDays, color: 'purple' },
  ];
 
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-600">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-600">Recent Activity</h2>
        <p className="text-sm text-gray-700">
          Recent patient registrations and appointments will appear here.
        </p>
      </div>
    </div>
  );
}
