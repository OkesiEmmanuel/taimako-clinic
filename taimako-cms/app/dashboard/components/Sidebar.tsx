'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, LayoutDashboard, UserCog, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Staff', href: '/dashboard/staff', icon: UserCog },
    { name: 'Leave mgt', href: '/dashboard/staff/leave', icon: UserCog },

  ];

  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 bg-white shadow-lg flex flex-col justify-between"
    >
      <div>
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-blue-700">Taimako</h1>
          <p className="text-sm text-gray-500">Clinic Dashboard</p>
        </div>

        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition 
                ${pathname === item.href ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-6 py-4 border-t">
        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}
