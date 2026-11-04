// components/EmptyState.jsx — Reusable empty state illustration
import { FileX } from 'lucide-react';

const EmptyState = ({ icon: Icon = FileX, title = 'No items found', description = '', action }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
      <Icon size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
