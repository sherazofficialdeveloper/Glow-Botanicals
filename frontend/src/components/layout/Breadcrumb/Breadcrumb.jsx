// components/layout/Breadcrumb/Breadcrumb.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({
  items = [],
  className = '',
  showHome = true,
  separator = <ChevronRight className="w-3.5 h-3.5 text-gray-400" />,
}) => {
  const pathname = usePathname();

  // If no items provided, generate from pathname
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs(pathname);

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className={`flex items-center space-x-1 text-xs ${className}`} aria-label="Breadcrumb">
      {/* Home */}
      {showHome && (
        <>
          <Link
            href="/"
            className="text-gray-500 hover:text-[#d9006c] transition-colors flex items-center"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span className="text-gray-300">{separator}</span>
        </>
      )}

      {/* Breadcrumb Items */}
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={index} className="flex items-center space-x-1">
            {index > 0 && <span className="text-gray-300">{separator}</span>}
            
            {isLast ? (
              <span className="font-semibold text-gray-900 capitalize">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.path}
                className="text-gray-500 hover:text-[#d9006c] transition-colors capitalize"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

// Helper function to generate breadcrumbs from pathname
const generateBreadcrumbs = (pathname) => {
  if (!pathname || pathname === '/') return [];

  const segments = pathname.split('/').filter(Boolean);
  const items = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    // Skip dynamic segments like [id]
    const label = segment.replace(/[\[\]]/g, '');
    const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);
    
    items.push({
      label: displayLabel,
      path: currentPath,
    });
  }

  return items;
};

// Breadcrumb Item Component
export const BreadcrumbItem = ({ children, href, isLast, ...props }) => {
  if (isLast) {
    return <span className="font-semibold text-gray-900" {...props}>{children}</span>;
  }
  return (
    <Link href={href} className="text-gray-500 hover:text-[#d9006c] transition-colors" {...props}>
      {children}
    </Link>
  );
};