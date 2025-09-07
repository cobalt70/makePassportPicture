import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateIcon, ZoomInIcon, ZoomOutIcon, ResetIcon } from './Icons';

interface ImageEditorProps {
  imageSrc: string;
  onGenerate: (editedImageBase64: string) => void;
  onCancel: () => void;
  error: string | null;
}

const CANVAS_WIDTH = 420; // 3.5cm * 120
const CANVAS_HEIGHT = 540; // 4.5cm * 120

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onGenerate, onCancel, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialTransforms, setInitialTransforms] = useState<{ zoom: number; rotation: number; offset: { x: number; y: number; }; } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imageRef.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img.width === 0) return; // Don't draw if image not loaded

    ctx.save();
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.translate(cx + offset.x, cy + offset.y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(zoom, zoom);
    
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();
  }, [zoom, rotation, offset]);

  useEffect(() => {
    const img = imageRef.current;
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    const setInitialView = () => {
      if (!img.complete || img.naturalWidth === 0) {
        // Image not loaded yet, wait for onload
        return;
      }
      
      const hRatio = CANVAS_WIDTH / img.width;
      const vRatio = CANVAS_HEIGHT / img.height;
      const initialZoom = Math.min(hRatio, vRatio);
      
      const transforms = { zoom: initialZoom, offset: { x: 0, y: 0 }, rotation: 0 };
      
      setInitialTransforms(transforms);
      setZoom(transforms.zoom);
      setOffset(transforms.offset);
      setRotation(transforms.rotation);
    };

    img.onload = setInitialView;
    // If image is already cached and loaded
    if (img.complete && img.naturalWidth > 0) {
      setInitialView();
    }

  }, [imageSrc]);

  useEffect(() => {
    draw();
  }, [draw]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.max(0.1, Math.min(newZoom, 5)));
  };
  
  const resetTransforms = () => {
    if (initialTransforms) {
        setZoom(initialTransforms.zoom);
        setOffset(initialTransforms.offset);
        setRotation(initialTransforms.rotation);
    }
  };

  const handleGenerateClick = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const base64Image = canvas.toDataURL('image/png', 1.0);
      onGenerate(base64Image);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
      <div className="relative w-[350px] h-[450px] lg:w-[420px] lg:h-[540px] bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          className="cursor-grab active:cursor-grabbing"
        />
        {/* Passport Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none border-8 border-black/10">
          <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-black/20"></div>
          <div className="absolute bottom-[13%] left-0 right-0 h-[1px] bg-black/20"></div>
          <div className="absolute left-[50%] top-[20%] bottom-[13%] w-[60%] border-l border-r border-dashed border-black/20 -translate-x-1/2"></div>
        </div>
      </div>

      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">사진 조정</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">얼굴이 안내선 안에 위치하도록 사진을 조정하세요.</p>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <ZoomOutIcon className="w-6 h-6 text-gray-500"/>
             <input type="range" min="0.1" max="3" step="0.01" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
             <ZoomInIcon className="w-6 h-6 text-gray-500"/>
          </div>
          <div className="flex items-center gap-4">
             <RotateIcon className="w-6 h-6 text-gray-500"/>
             <input type="range" min="-45" max="45" step="1" value={rotation} onChange={e => setRotation(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
             <span className="text-sm font-mono w-10 text-right">{rotation}°</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
            <button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isGenerating ? '생성 중...' : 'AI로 여권 사진 생성'}
            </button>
            <button onClick={resetTransforms} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:cursor-not-allowed">
                <ResetIcon className="w-5 h-5"/> 조정 초기화
            </button>
            <button onClick={onCancel} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-2">
                다른 사진으로 다시 시작
            </button>
        </div>
      </div>
    </div>
  );
};