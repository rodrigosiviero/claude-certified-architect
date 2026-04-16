import { useState } from 'react';

interface DiagramSvgProps {
  svgContent: string;
  alt?: string;
}

export default function DiagramSvg({ svgContent, alt }: DiagramSvgProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="my-6 w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs text-slate-400 font-medium">{alt || 'Diagram'}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
          >
            −
          </button>
          <span className="text-xs text-slate-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="text-xs text-slate-400 hover:text-slate-600 ml-1 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      <div
        className="bg-[#1a1b2e] rounded-2xl p-6 overflow-auto border border-slate-700/50 shadow-lg"
        style={{ maxHeight: '600px' }}
      >
        <div
          className="mx-auto origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}
