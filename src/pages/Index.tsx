import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image] = useState('https://cdn.poehali.dev/files/f3637bc8-afe2-4c79-96bc-a0f2e9e65f58.jpg');
  const [snowIntensity, setSnowIntensity] = useState([70]);
  const [snowflakes, setSnowflakes] = useState([80]);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    applyWinterEffect();
  }, [snowIntensity, snowflakes, brightness, contrast]);

  const applyWinterEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const snowCover = snowIntensity[0] / 100;
      for (let i = 0; i < data.length; i += 4) {
        const y = Math.floor(i / 4 / canvas.width);
        const isGround = y > canvas.height * 0.5;
        
        if (isGround) {
          const snowEffect = Math.random() < snowCover ? 1 : 0.3;
          data[i] = Math.min(255, data[i] + 80 * snowEffect);
          data[i + 1] = Math.min(255, data[i + 1] + 90 * snowEffect);
          data[i + 2] = Math.min(255, data[i + 2] + 100 * snowEffect);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const numFlakes = Math.floor((snowflakes[0] / 100) * 300);
      for (let i = 0; i < numFlakes; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 4 + 1;
        const opacity = Math.random() * 0.8 + 0.2;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.7) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(200, 220, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(180, 200, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setTimeout(() => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'winter-photo.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsProcessing(false);
      }, 'image/png');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex">
      <div className="w-80 bg-[#0F1419] p-6 flex flex-col border-r border-[#2A2F3C]">
        <div className="flex items-center gap-3 mb-8">
          <Icon name="Snowflake" size={28} className="text-[#3A9FF5]" />
          <h1 className="text-xl font-semibold">Winter Studio</h1>
        </div>

        <div className="space-y-8 flex-1">
          <div>
            <h2 className="text-sm font-medium mb-4 text-gray-400 uppercase tracking-wider">Эффекты</h2>
            
            <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="CloudSnow" size={18} className="text-[#3A9FF5]" />
                <label className="text-sm font-medium">Снежный покров</label>
              </div>
              <Slider
                value={snowIntensity}
                onValueChange={setSnowIntensity}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">{snowIntensity[0]}%</p>
            </Card>

            <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Sparkles" size={18} className="text-[#3A9FF5]" />
                <label className="text-sm font-medium">Снежинки</label>
              </div>
              <Slider
                value={snowflakes}
                onValueChange={setSnowflakes}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">{snowflakes[0]}%</p>
            </Card>
          </div>

          <Separator className="bg-[#2A2F3C]" />

          <div>
            <h2 className="text-sm font-medium mb-4 text-gray-400 uppercase tracking-wider">Цветокоррекция</h2>
            
            <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Sun" size={18} className="text-[#3A9FF5]" />
                <label className="text-sm font-medium">Яркость</label>
              </div>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                max={150}
                min={50}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">{brightness[0]}%</p>
            </Card>

            <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Circle" size={18} className="text-[#3A9FF5]" />
                <label className="text-sm font-medium">Контраст</label>
              </div>
              <Slider
                value={contrast}
                onValueChange={setContrast}
                max={150}
                min={50}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">{contrast[0]}%</p>
            </Card>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button 
            onClick={downloadImage}
            disabled={isProcessing}
            className="w-full bg-[#3A9FF5] hover:bg-[#2A8FE5] text-white font-medium h-11"
          >
            <Icon name="Download" size={18} className="mr-2" />
            {isProcessing ? 'Обработка...' : 'Экспорт изображения'}
          </Button>
          <p className="text-xs text-center text-gray-500">Сохранить как PNG</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-[#141923]">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[calc(100vh-4rem)] rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
