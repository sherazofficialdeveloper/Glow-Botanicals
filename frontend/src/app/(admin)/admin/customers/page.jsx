// app/(admin)/admin/customers/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Mail, Phone, Calendar } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function AdminCustomersPage() {
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10,
  });

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomers({ page, limit: 10, search });
      setCustomers(data.items);
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.totalPages,
        limit: data.limit,
      });
    } catch (error) {
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchCustomers();
  }, [page, search]);

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          <span>{row.phone || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.orderCount || 0} orders
        </Badge>
      ),
    },
    {
      key: 'spent',
      label: 'Total Spent',
      render: (row) => (
        <span className="font-semibold text-gray-900">
          ${row.totalSpent?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => (
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'} size="sm">
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Link
          href={`/admin/customers/${row._id}`}
          className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500">View and manage your customers</p>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        loading={loading}
        pagination={{
          page: pagination.page,
          total: pagination.total,
          totalPages: pagination.totalPages,
          limit: pagination.limit,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        searchPlaceholder="Search customers by name or email..."
        emptyMessage="No customers found"
      />
    </div>
  );
}