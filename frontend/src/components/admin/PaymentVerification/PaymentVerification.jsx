// components/admin/PaymentVerification/PaymentVerification.jsx
'use client';

import { useState } from 'react';
import { Check, X, AlertCircle, Eye, Download } from 'lucide-react';
import { DataTable } from '../DataTable';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

export const PaymentVerification = ({
  verifications,
  loading,
  pagination,
  onVerify,
  onReject,
  onPageChange,
}) => {
  const [selectedVerification, setSelectedVerification] = useState(null);

  const columns = [
    {
      key: 'order',
      label: 'Order',
      render: (row) => (
        <div>
          <div className="font-mono text-sm font-medium text-[#d9006c]">
            #{row.order?.orderNumber}
          </div>
          <div className="text-xs text-gray-500">
            ${row.order?.total?.toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.user?.name || 'Guest'}
          </div>
          <div className="text-xs text-gray-500">{row.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <div className="font-semibold text-gray-900">
          ${row.amount?.toFixed(2)}
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (row) => (
        <Badge variant="info" size="sm">
          {row.paymentMethod?.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const statusColors = {
          pending: 'warning',
          verified: 'success',
          rejected: 'danger',
        };
        return (
          <Badge variant={statusColors[row.status] || 'secondary'} size="sm">
            {row.status}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      sortable: true,
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.createdAt).toLocaleDateString()}
          <div className="text-xs">
            {new Date(row.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSelectedVerification(row)}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify(row._id)}
                className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(row._id)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={verifications}
        columns={columns}
        loading={loading}
        pagination={pagination}
        searchPlaceholder="Search payment verifications..."
        emptyMessage="No payment verifications found"
      />

      {/* Detail Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Payment Verification Details
              </h3>
              <button
                onClick={() => setSelectedVerification(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">Order #</span>
                <span className="font-mono font-medium">
                  #{selectedVerification.order?.orderNumber}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">Customer</span>
                <span className="font-medium">
                  {selectedVerification.user?.name}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="font-bold text-gray-900">
                  ${selectedVerification.amount?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">Method</span>
                <Badge variant="info" size="sm">
                  {selectedVerification.paymentMethod?.toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">Status</span>
                <Badge
                  variant={
                    selectedVerification.status === 'verified'
                      ? 'success'
                      : selectedVerification.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                >
                  {selectedVerification.status}
                </Badge>
              </div>

              {selectedVerification.proofImage && (
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500 block mb-2">
                    Proof Image
                  </span>
                  <img
                    src={selectedVerification.proofImage}
                    alt="Payment proof"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {selectedVerification.notes && (
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500 block mb-1">
                    Notes
                  </span>
                  <p className="text-sm text-gray-700">
                    {selectedVerification.notes}
                  </p>
                </div>
              )}
            </div>

            {selectedVerification.status === 'pending' && (
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={() => {
                    onVerify(selectedVerification._id);
                    setSelectedVerification(null);
                  }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Verify Payment
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onReject(selectedVerification._id);
                    setSelectedVerification(null);
                  }}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};