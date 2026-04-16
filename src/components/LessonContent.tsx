import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import MermaidDiagram from './MermaidDiagram';

interface LessonContentProps {
  content: string;
  domainColor?: string;
  diagrams?: Record<string, string>;
}

export default function LessonContent({ content, domainColor = 'blue', diagrams }: LessonContentProps) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    violet: 'text-violet-600',
    orange: 'text-orange-600',
    rose: 'text-rose-600',
  };
  const accentColor = colorMap[domainColor] || colorMap.blue;

  return (
    <div className="lesson-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200 flex items-center gap-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-slate-800 mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={`text-base font-semibold ${accentColor} mt-4 mb-2`}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-800 dark:text-slate-200">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-500 dark:text-slate-400">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 mb-3 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 mb-3 ml-4 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children, ordered }) => (
            <li className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
              {!ordered && (
                <span className={`w-1.5 h-1.5 ${accentColor.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`} />
              )}
              <span className="flex-1">{children}</span>
            </li>
          ),
          code: ({ className, children }) => {
            const lang = className?.replace('language-', '') || '';
            const isBlock = className?.includes('language-');

            if (lang === 'mermaid') {
              return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
            }

            if (isBlock) {
              return (
                <div className="relative my-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="bg-slate-800 text-slate-200 text-xs px-3 py-1 font-mono">
                    {lang || 'code'}
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => (
            <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-lg p-4 my-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 text-lg">💡</span>
                <div className="text-sm text-amber-900">{children}</div>
              </div>
            </div>
          ),
          hr: () => (
            <hr className="my-4 border-slate-200 dark:border-slate-700" />
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 text-left">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-slate-700 border-b border-slate-200 dark:border-slate-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-slate-600 border-b border-slate-100">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
