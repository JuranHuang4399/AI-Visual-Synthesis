function Showcase() {
  // Placeholder example characters
  const examples = [
    {
      id: 1,
      name: "Shadow Knight",
      image:
        "https://cdn.pixabay.com/photo/2023/02/19/03/15/character-7799114_1280.png",
      description: "A mysterious warrior from the dark realm",
    },
    {
      id: 2,
      name: "Cyber Mage",
      image:
        "https://cdn.pixabay.com/photo/2025/02/08/09/02/stamp-9391729_1280.png",
      description: "Master of digital magic and code",
    },
    {
      id: 3,
      name: "Neon Archer",
      image:
        "https://cdn.pixabay.com/photo/2021/03/02/17/26/pixel-6063246_1280.png",
      description: "Swift hunter with glowing arrows",
    },
  ];

  return (
    <section className="py-20 bg-cyber-dark-200">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="text-glow-pink">Example Characters</span>
        </h2>
        <p className="text-center text-gray-400 mb-12">
          See what others have created
        </p>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div key={example.id} className="card-cyber group cursor-pointer">
              {/* Character Image */}
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={example.image}
                  alt={example.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark-300 to-transparent opacity-60"></div>
              </div>

              {/* Character Info */}
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">
                {example.name}
              </h3>
              <p className="text-gray-400 text-sm">{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Showcase;
