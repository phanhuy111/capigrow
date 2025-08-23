export const mockNotifications = [
  {
    id: '1',
    type: 'investment_update',
    title: 'Investment Performance Update',
    message: 'Your Green Energy Fund investment has gained 5% this month',
    isRead: false,
    priority: 'medium',
    data: {
      investmentId: '1',
      performanceChange: 5.0,
    },
    createdAt: '2024-06-15T09:00:00Z',
  },
  {
    id: '2',
    type: 'transaction_completed',
    title: 'Transaction Completed',
    message: 'Your investment of 50,000,000 VND has been processed successfully',
    isRead: true,
    priority: 'high',
    data: {
      transactionId: '1',
      amount: 50000000,
    },
    createdAt: '2024-01-15T10:35:00Z',
  },
  {
    id: '3',
    type: 'verification_approved',
    title: 'Identity Verification Approved',
    message: 'Your identity verification has been approved. You can now invest up to 500,000,000 VND',
    isRead: true,
    priority: 'high',
    data: {
      verificationType: 'identity',
      newLimit: 500000000,
    },
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '4',
    type: 'new_investment',
    title: 'New Investment Opportunity',
    message: 'Healthcare Innovation Fund is now available for investment',
    isRead: false,
    priority: 'low',
    data: {
      investmentId: '4',
      category: 'Healthcare',
    },
    createdAt: '2024-06-14T15:30:00Z',
  },
  {
    id: '5',
    type: 'dividend_received',
    title: 'Dividend Payment Received',
    message: 'You received 2,500,000 VND dividend from Green Energy Fund',
    isRead: true,
    priority: 'medium',
    data: {
      investmentId: '1',
      amount: 2500000,
      transactionId: '4',
    },
    createdAt: '2024-04-01T12:05:00Z',
  },
];

export const mockNotificationSettings = {
  push: {
    enabled: true,
    investment_updates: true,
    transaction_alerts: true,
    new_opportunities: true,
    security_alerts: true,
  },
  email: {
    enabled: true,
    weekly_summary: true,
    monthly_report: true,
    important_updates: true,
  },
  sms: {
    enabled: false,
    security_alerts: true,
    transaction_confirmations: false,
  },
};
