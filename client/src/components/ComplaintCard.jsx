// components/ComplaintCard.jsx — Card for complaint list items
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate, truncate } from '../utils/helpers';
import { CATEGORY_ICONS } from '../utils/constants';

const ComplaintCard = ({ complaint, basePath = '/student/complaints' }) => {
  return (
    <Link
      to={`${basePath}/${complaint._id}`}
      className="card p-5 block hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-700 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl shrink-0 mt-0.5">
            {CATEGORY_ICONS[complaint.category] || '📋'}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors truncate">
              {complaint.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {truncate(complaint.description, 120)}
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400 shrink-0 mt-1 group-hover:text-primary-500 transition-colors" />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <StatusBadge status={complaint.status} />
        <PriorityBadge priority={complaint.priority} />
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
          {complaint.category}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {complaint.location?.hostel}
          {complaint.location?.block && ` · Block ${complaint.location.block}`}
          {complaint.location?.room && ` · Room ${complaint.location.room}`}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(complaint.createdAt)}
        </span>
        {complaint.createdBy && (
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {complaint.createdBy.name}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ComplaintCard;
