/**
 * Page Layout Component
 * Reusable layout wrapper for pages with animated background and container
 * 
 * Props:
 * - children: Page content
 * - backgroundGifCount: Number of GIFs for background (default: 1)
 * - showBackButton: Whether to show back button (default: false)
 * - backButtonTo: Custom path for back button (optional)
 * - className: Additional CSS classes for container
 */
import AnimatedBackground from './AnimatedBackground';
import BackButton from './BackButton';

function PageLayout({ 
  children, 
  backgroundGifCount = 1, 
  showBackButton = false,
  backButtonTo,
  className = ''
}) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground randomCount={backgroundGifCount} />
      <div className={`relative z-10 container mx-auto px-4 py-8 ${className}`}>
        {showBackButton && (
          <div className="mb-6">
            <BackButton to={backButtonTo} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default PageLayout;

