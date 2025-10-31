import { useState } from 'react';

function ActionButtons({ onDownloadAll, onSaveToGallery }) {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    await onSaveToGallery();
    setIsSaving(false);
  };
  
  return (
    <div className="flex gap-4 mt-6">
      {/* Download All Button */}
      <button
        onClick={onDownloadAll}
        className="flex-1 btn-cyber-secondary"
      >
        <span className="flex items-center justify-center gap-2">
          <span>📥</span>
          Download All
        </span>
      </button>
      
      {/* Save to Gallery Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`flex-1 btn-cyber-primary ${
          isSaving ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save to Gallery
            </>
          )}
        </span>
      </button>
    </div>
  );
}

export default ActionButtons;
