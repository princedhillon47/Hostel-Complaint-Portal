// utils/constants.js
export const CATEGORIES = [
  'Water', 'Electricity', 'Mess', 'Cleaning',
  'Internet', 'Furniture', 'Security', 'Plumbing', 'AC/Heating', 'Other',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export const STATUS_COLORS = {
  Pending:     { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', dot: 'bg-yellow-500' },
  'In Progress': { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-800 dark:text-blue-300',     dot: 'bg-blue-500'   },
  Resolved:    { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-800 dark:text-green-300',   dot: 'bg-green-500'  },
  Rejected:    { bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-800 dark:text-red-300',       dot: 'bg-red-500'    },
};

export const PRIORITY_COLORS = {
  Low:    { bg: 'bg-gray-100 dark:bg-gray-700',    text: 'text-gray-600 dark:text-gray-300' },
  Medium: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  High:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  Urgent: { bg: 'bg-red-100 dark:bg-red-900/30',   text: 'text-red-700 dark:text-red-300'   },
};

export const CATEGORY_ICONS = {
  Water: '💧', Electricity: '⚡', Mess: '🍽️', Cleaning: '🧹',
  Internet: '🌐', Furniture: '🪑', Security: '🔒', Plumbing: '🔧',
  'AC/Heating': '❄️', Other: '📋',
};
