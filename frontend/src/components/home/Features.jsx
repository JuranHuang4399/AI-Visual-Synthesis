function Features() {
  const features = [
    {
      icon: "🎨",
      title: "AI Art Generation",
      description:
        "Powered by Stable Diffusion to create unique pixel art characters",
      color: "cyber-pink",
    },
    {
      icon: "📖",
      title: "Story Creation",
      description: "GPT-4 generates compelling backstories for your characters",
      color: "cyber-purple",
    },
    {
      icon: "🎬",
      title: "Animation Ready",
      description: "Multiple frames perfect for game character animation",
      color: "cyber-cyan",
    },
    {
      icon: "💾",
      title: "Save & Download",
      description: "Store characters in your gallery and download as ZIP",
      color: "cyber-yellow",
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center text-cyber-cyan mb-12">
        Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card-cyber text-center">
            {/* Icon */}
            <div className={`text-5xl mb-4 text-${feature.color}`}>
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-cyber-cyan mb-3">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
