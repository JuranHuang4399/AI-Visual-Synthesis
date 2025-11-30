/**
 * GIF测试页面 - 用于调试GIF显示问题
 */
import AnimatedBackground from '../components/common/AnimatedBackground';
import BackButton from '../components/common/BackButton';

function GifTestPage() {
  return (
    <div className="min-h-screen relative">
      {/* 使用所有GIF进行测试 */}
      <AnimatedBackground randomCount={3} />
      
      {/* 测试内容 */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 text-glow-cyan">
          🎬 GIF测试页面
        </h1>
        
        <div className="bg-cyber-dark-200/80 p-6 rounded-lg border-2 border-cyber-cyan">
          <h2 className="text-2xl font-bold mb-4 text-cyber-pink">直接测试GIF文件</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-cyber-cyan mb-2">GIF 1</p>
              <img 
                src="/gifs/80S Pixel Art GIF.gif" 
                alt="Test GIF 1"
                className="w-32 h-32 mx-auto border-2 border-cyber-cyan"
                onLoad={() => console.log('✅ GIF 1 加载成功')}
                onError={(e) => {
                  console.error('❌ GIF 1 加载失败', e);
                  e.target.style.border = '2px solid red';
                }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-cyber-cyan mb-2">GIF 2</p>
              <img 
                src="/gifs/Pixel Art GIF.gif" 
                alt="Test GIF 2"
                className="w-32 h-32 mx-auto border-2 border-cyber-cyan"
                onLoad={() => console.log('✅ GIF 2 加载成功')}
                onError={(e) => {
                  console.error('❌ GIF 2 加载失败', e);
                  e.target.style.border = '2px solid red';
                }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-cyber-cyan mb-2">GIF 3</p>
              <img 
                src="/gifs/pixel GIF by haydiroket (Mert Keskin).gif" 
                alt="Test GIF 3"
                className="w-32 h-32 mx-auto border-2 border-cyber-cyan"
                onLoad={() => console.log('✅ GIF 3 加载成功')}
                onError={(e) => {
                  console.error('❌ GIF 3 加载失败', e);
                  e.target.style.border = '2px solid red';
                }}
              />
            </div>
          </div>
          
          <div className="bg-cyber-dark-300 p-4 rounded">
            <h3 className="text-lg font-bold mb-2 text-cyber-cyan">调试说明：</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>打开浏览器控制台（F12）查看加载日志</li>
              <li>如果GIF显示红色边框，说明加载失败</li>
              <li>检查Network标签查看HTTP状态码</li>
              <li>背景中应该有3个浮动的GIF动画</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GifTestPage;

