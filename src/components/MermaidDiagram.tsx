import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, '_');
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = resolvedTheme === 'dark';

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'base',
          themeVariables: isDark ? {
            primaryColor: '#1e293b',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#475569',
            lineColor: '#64748b',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            fontSize: '15px',
            fontFamily: 'Inter, system-ui, sans-serif',
            clusterBkg: '#0f172a',
            clusterBorder: '#334155',
            nodeTextColor: '#e2e8f0',
            edgeLabelBackground: '#1e293b',
          } : {
            primaryColor: '#dbeafe',
            primaryTextColor: '#1e293b',
            primaryBorderColor: '#3b82f6',
            lineColor: '#64748b',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#ede9fe',
            fontSize: '15px',
            fontFamily: 'Inter, system-ui, sans-serif',
            clusterBkg: '#f8fafc',
            clusterBorder: '#cbd5e1',
            nodeTextColor: '#1e293b',
            edgeLabelBackground: '#ffffff',
          },
          flowchart: { curve: 'basis', padding: 20, nodeSpacing: 50, rankSpacing: 60, htmlLabels: true, useMaxWidth: false },
          sequence: { actorMargin: 60, messageMargin: 40, mirrorActors: false, useMaxWidth: false },
          stateDiagram: { useMaxWidth: false },
        });

        const id = `mermaid_${reactId}_${Date.now()}`;
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled) {
          setHtml(svg);
          setError(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Mermaid render failed:', err);
          setError(true);
        }
      }
    }

    renderChart();
    return () => { cancelled = true; };
  }, [chart, reactId, resolvedTheme]);

  if (error) {
    return (
      <div className="my-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl text-center">
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2">Diagram source (render failed):</p>
        <pre className="text-xs text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/20 p-3 rounded overflow-x-auto text-left whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-6 w-full">
      <div className="flex items-center justify-end mb-2 px-1 gap-2">
        <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm font-bold transition-colors">−</button>
        <span className="text-xs text-slate-400 dark:text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(Math.min(3, zoom + 0.25))} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm font-bold transition-colors">+</button>
        <button onClick={() => setZoom(1)} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Reset</button>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm overflow-auto transition-colors" style={{ maxHeight: '600px' }}>
        <div
          className="origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', minWidth: '700px' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
