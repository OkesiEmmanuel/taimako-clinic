'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiClock, FiFileText, FiChevronDown, FiUser } from 'react-icons/fi';
import { useState } from 'react';

interface LinkItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: LinkItem[];
}

const links: LinkItem[] = [
  { label: 'Dashboard', href: '/staff', icon: <FiHome /> },
  {
    label: 'Shifts', icon: <FiClock />, href: '/staff/dashboard/shifts' },
  { label: 'Reports', href: '/staff/dashboard/reports', icon: <FiFileText /> },
  { label: 'Profile', href: '/staff/profile', icon: <FiUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderLink = (link: LinkItem) => {
    const isActive = link.href && pathname === link.href;

    if (link.children) {
      const isOpen = openSections[link.label] || false;

      return (
        <div key={link.label} className="mb-1">
          <div
            onClick={() => toggleSection(link.label)}
            className={`flex items-center justify-between p-3 mx-3 rounded cursor-pointer ${
              isOpen ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {link.icon && <span className="text-lg">{link.icon}</span>}
              <span className="font-medium">{link.label}</span>
            </div>
            <FiChevronDown
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-8 flex flex-col"
              >
                {link.children.map(child => {
                  const isChildActive = child.href && pathname === child.href;
                  return (
                    <Link key={child.href} href={child.href!}>
                      <div
                        className={`p-2 my-1 rounded cursor-pointer ${
                          isChildActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {child.label}
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link key={link.href} href={link.href!}>
        <div
          className={`flex items-center gap-3 p-3 mx-3 rounded cursor-pointer ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {link.icon && <span className="text-lg">{link.icon}</span>}
          <span className="font-medium">{link.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Staff Portal</h1>
      </div>
      <nav className="mt-6 space-y-1">{links.map(renderLink)}</nav>
    </aside>
  );
}
