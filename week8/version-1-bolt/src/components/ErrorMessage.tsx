interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export default function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-start justify-between">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="text-red-200 font-medium">Error</h3>
          <p className="text-red-300 text-sm mt-1">{message}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-200 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
