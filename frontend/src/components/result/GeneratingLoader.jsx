function GeneratingLoader({ message = 'Generating...', subMessage = '' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      {/* Spinner */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-cyber-cyan/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-cyber-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Message */}
      <p className="text-cyber-cyan text-xl font-bold mb-2">{message}</p>
      {subMessage && (
        <p className="text-gray-400 text-sm">{subMessage}</p>
      )}
    </div>
  );
}

export default GeneratingLoader;
