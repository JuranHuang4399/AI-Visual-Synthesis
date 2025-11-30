/**
 * 像素小恐龙背景组件
 * 在登录界面背景添加五颜六色的像素小恐龙在走路
 */
import { useState, useEffect } from 'react';

// 恐龙颜色配置（五颜六色）
const DINOSAUR_COLORS = [
  { body: '#ff006e', eye: '#ffffff', belly: '#ff4da6' }, // 粉色
  { body: '#00d9ff', eye: '#ffffff', belly: '#4de6ff' }, // 青色
  { body: '#bd00ff', eye: '#ffffff', belly: '#d24dff' }, // 紫色
  { body: '#ffea00', eye: '#000000', belly: '#fff44f' }, // 黄色
  { body: '#00ff88', eye: '#ffffff', belly: '#4dffaa' }, // 绿色
  { body: '#ff8800', eye: '#ffffff', belly: '#ffaa4d' }, // 橙色
  { body: '#8800ff', eye: '#ffffff', belly: '#aa4dff' }, // 深紫色
  { body: '#00ffea', eye: '#000000', belly: '#4dfff4' }, // 青绿色
];

// 生成随机位置和速度
function generateDinosaurProps(index, total) {
  const colors = DINOSAUR_COLORS[index % DINOSAUR_COLORS.length];
  // 分布在5条横向通道上
  const lane = index % 5;
  // 使用50%作为中心起点，动画会处理全屏移动
  const startX = 50; // 屏幕中心，动画会从左侧外移动到右侧外
  const duration = 10 + (index % 3) * 3; // 10-16秒完成一次循环
  const delay = (index * 0.8) % 5; // 错开开始时间
  
  return {
    colors,
    top: `${10 + lane * 18}%`, // 分布在不同的高度（10%, 28%, 46%, 64%, 82%）
    duration: `${duration}s`,
    delay: `${delay}s`,
    startX,
  };
}

// 像素恐龙SVG组件
function PixelDinosaur({ colors }) {
  return (
    <div className="pixel-dinosaur-walk">
      <svg
        width="40"
        height="40"
        viewBox="0 0 32 32"
        style={{ display: 'block', imageRendering: 'pixelated' }}
        preserveAspectRatio="none"
      >
        {/* 身体（主躯干） */}
        <rect x="8" y="12" width="16" height="12" fill={colors.body} />
        {/* 肚子（浅色） */}
        <rect x="10" y="14" width="12" height="8" fill={colors.belly} />
        {/* 头部 */}
        <rect x="4" y="8" width="12" height="10" fill={colors.body} />
        {/* 眼睛 */}
        <rect x="6" y="10" width="3" height="3" fill={colors.eye} />
        <rect x="10" y="10" width="3" height="3" fill={colors.eye} />
        {/* 嘴巴 */}
        <rect x="4" y="16" width="4" height="2" fill={colors.body} />
        {/* 前腿（左） */}
        <rect x="6" y="24" width="4" height="6" fill={colors.body} />
        {/* 前腿（右） */}
        <rect x="10" y="24" width="4" height="6" fill={colors.body} />
        {/* 后腿（左） */}
        <rect x="18" y="24" width="4" height="6" fill={colors.body} />
        {/* 后腿（右） */}
        <rect x="22" y="24" width="4" height="6" fill={colors.body} />
        {/* 尾巴 */}
        <rect x="24" y="14" width="4" height="4" fill={colors.body} />
        <rect x="26" y="10" width="2" height="4" fill={colors.body} />
        {/* 背部装饰（可选） */}
        <rect x="10" y="10" width="2" height="2" fill={colors.belly} />
      </svg>
    </div>
  );
}

function PixelDinosaurBackground() {
  const [dinosaurs, setDinosaurs] = useState([]);

  useEffect(() => {
    // 创建12个恐龙（五颜六色）
    const count = 12;
    const dinoList = Array.from({ length: count }, (_, index) => {
      const props = generateDinosaurProps(index, count);
      return {
        id: `dino-${index}`,
        ...props,
      };
    });
    setDinosaurs(dinoList);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* 背景渐变层 */}
      <div className="absolute inset-0 bg-cyber-gradient cyber-grid-bg" />
      
      {/* 像素小恐龙 */}
      {dinosaurs.map((dino) => (
        <div
          key={dino.id}
          style={{
            position: 'absolute',
            top: dino.top,
            left: `${dino.startX}%`,
            animation: `dinosaurWalk ${dino.duration} linear infinite`,
            animationDelay: dino.delay,
            filter: `drop-shadow(0 0 6px ${dino.colors.body}80) drop-shadow(0 0 2px rgba(0, 217, 255, 0.4))`,
            opacity: 0.8,
            zIndex: 1,
          }}
        >
          <PixelDinosaur colors={dino.colors} />
        </div>
      ))}
    </div>
  );
}

export default PixelDinosaurBackground;

