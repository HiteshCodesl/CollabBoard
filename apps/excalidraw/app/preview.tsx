"use client"
import React, { useRef, useState, useEffect } from 'react';
import { Square, Circle, Minus, Palette, RotateCcw, Eraser } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Shape {
  type: 'rectangle' | 'circle' | 'line' | 'freehand';
  points: Point[];
  color: string;
  strokeWidth: number;
}

const WhiteboardPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'rectangle' | 'circle' | 'line' | 'freehand' | 'eraser'>('freehand');
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all shapes
    shapes.forEach(shape => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (shape.type === 'freehand') {
        if (shape.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          ctx.stroke();
        }
      } else if (shape.type === 'rectangle' && shape.points.length === 2) {
        const [start, end] = shape.points;
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (shape.type === 'circle' && shape.points.length === 2) {
        const [start, end] = shape.points;
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape.type === 'line' && shape.points.length === 2) {
        const [start, end] = shape.points;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    });

    // Draw current shape being drawn
    if (currentShape) {
      ctx.strokeStyle = currentShape.color;
      ctx.lineWidth = currentShape.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentShape.type === 'freehand') {
        if (currentShape.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(currentShape.points[0].x, currentShape.points[0].y);
          for (let i = 1; i < currentShape.points.length; i++) {
            ctx.lineTo(currentShape.points[i].x, currentShape.points[i].y);
          }
          ctx.stroke();
        }
      } else if (currentShape.type === 'rectangle' && currentShape.points.length === 2) {
        const [start, end] = currentShape.points;
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (currentShape.type === 'circle' && currentShape.points.length === 2) {
        const [start, end] = currentShape.points;
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (currentShape.type === 'line' && currentShape.points.length === 2) {
        const [start, end] = currentShape.points;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    }
  }, [shapes, currentShape]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'eraser') return;

    setIsDrawing(true);
    const point = getMousePos(e);
    setStartPoint(point);

    const newShape: Shape = {
      type: currentTool === 'eraser' ? 'freehand' : currentTool,
      points: [point],
      color: currentColor,
      strokeWidth: strokeWidth
    };

    setCurrentShape(newShape);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentShape) return;

    const point = getMousePos(e);

    if (currentTool === 'freehand') {
      setCurrentShape(prev => prev ? {
        ...prev,
        points: [...prev.points, point]
      } : null);
    } else if (startPoint) {
      setCurrentShape(prev => prev ? {
        ...prev,
        points: [startPoint, point]
      } : null);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      setShapes(prev => [...prev, currentShape]);
      setCurrentShape(null);
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  const clearCanvas = () => {
    setShapes([]);
    setCurrentShape(null);
  };

  return (
    <div className="relative max-w-4xl mx-auto mb-12 sm:mb-20 px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50/80 backdrop-blur-sm px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-200/50">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">CollabBoard - Interactive Whiteboard</div>
            <div className="ml-2 text-xs text-gray-600 font-medium sm:hidden">CollabBoard</div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Tools */}
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 rounded-xl p-1 sm:p-2 shadow-sm">
              <button
                onClick={() => setCurrentTool('freehand')}
                className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${currentTool === 'freehand'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Palette size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${currentTool === 'rectangle'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Square size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={() => setCurrentTool('circle')}
                className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${currentTool === 'circle'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Circle size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={() => setCurrentTool('line')}
                className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${currentTool === 'line'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Minus size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-1 bg-white/80 rounded-xl p-1 sm:p-2 shadow-sm">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 ${currentColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Clear */}
            <button
              onClick={clearCanvas}
              className="p-1 sm:p-2 bg-white/80 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 shadow-sm"
            >
              <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={window.innerWidth < 640 ? 600 : 800}
            height={window.innerWidth < 640 ? 300 : 400}
            className="w-full h-64 sm:h-96 cursor-crosshair bg-white"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Demo hint */}
          {shapes.length === 0 && !currentShape && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 logo-3d rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <p className="hero-text text-gray-600 text-base sm:text-lg font-medium">Try drawing something!</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 px-4">Use the tools above to create shapes and drawings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPreview;