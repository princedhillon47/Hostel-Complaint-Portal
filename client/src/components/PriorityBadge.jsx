// components/PriorityBadge.jsx
import { PRIORITY_COLORS } from '../utils/constants';

const PriorityBadge = ({ priority }) => {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS['Medium'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
