'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function DashboardCard({ title, value, icon: Icon, color = 'blue' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white shadow rounded-xl p-6 border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-700 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-500`}>
          <Icon className={`text-${color}-700`} size={24} />
        </div>
      </div>
    </motion.div>
  );
}
