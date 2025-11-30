/**
 * 动画背景装饰组件
 * 在背景上添加浮动的像素GIF装饰元素
 */
import { useState, useEffect } from 'react';

// 所有可用的GIF文件列表
// 注意：文件名中的空格和特殊字符会被浏览器自动处理
const ALL_GIFS = [
  '/gifs/80S Pixel Art GIF.gif',
  '/gifs/Pixel Art GIF.gif',
  '/gifs/pixel GIF by haydiroket (Mert Keskin).gif',
];

// 调试：打印所有GIF路径
console.log('🎬 所有可用的GIF文件:', ALL_GIFS);

// 随机打乱数组的函数
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 随机选择指定数量的GIF
function getRandomGifs(count, excludeGifs = []) {
  const available = ALL_GIFS.filter(gif => !excludeGifs.includes(gif));
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, Math.min(count, available.length));
}

function AnimatedBackground({ gifFiles = [], randomCount = null }) {
  const [selectedGif, setSelectedGif] = useState(null);

  useEffect(() => {
    let gif = null;

    if (gifFiles.length > 0) {
      // 如果提供了自定义GIF列表，使用第一个
      gif = gifFiles[0];
    } else if (randomCount !== null) {
      // 如果指定了数量，只选择1个GIF（忽略数量参数，因为我们要全屏背景）
      const gifs = getRandomGifs(1);
      gif = gifs[0] || null;
    } else {
      // 默认随机选择一个GIF
      const gifs = shuffleArray(ALL_GIFS);
      gif = gifs[0] || null;
    }

    console.log('🎬 AnimatedBackground: 选择的背景GIF:', gif);
    setSelectedGif(gif);
  }, [gifFiles, randomCount]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {/* 背景渐变层（作为fallback） */}
      <div className="absolute inset-0 bg-cyber-gradient cyber-grid-bg" />
      
      {/* 全屏背景GIF */}
      {selectedGif && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src={selectedGif}
            alt="Background GIF"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // 完全覆盖背景
              objectPosition: 'center',
              opacity: 0.3, // 降低透明度，让内容可见
            }}
            onLoad={(e) => {
              console.log(`✅ 背景GIF加载成功: ${selectedGif}`);
            }}
            onError={(e) => {
              console.error(`❌ 背景GIF加载失败: ${selectedGif}`, e);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AnimatedBackground;

