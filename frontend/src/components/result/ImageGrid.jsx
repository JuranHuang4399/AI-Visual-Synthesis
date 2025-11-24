import ImageCard from "./ImageCard";

function ImageGrid({ images = [] }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No images generated yet
      </div>
    );
  }

  // Fixed responsive display
  const baseCols =
    images.length <= 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cyber-cyan">
        Generated Pixel Art
      </h3>

      {/* Responsive Grid */}
      <div className={`grid ${baseCols} gap-4`}>
        {images.map((image, index) => (
          <ImageCard key={index} image={image} index={index} />
        ))}
      </div>
    </div>
  );
}

export default ImageGrid;
