// components/Loader.jsx
const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
      {text && <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="lg" text="Please wait..." />
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-5 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4" />
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  </div>
);

export default Loader;
