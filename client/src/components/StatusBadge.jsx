// components/StatusBadge.jsx
import { STATUS_COLORS } from '../utils/constants';

const StatusBadge = ({ status, size = 'sm' }) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['Pending'];
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClass} ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
