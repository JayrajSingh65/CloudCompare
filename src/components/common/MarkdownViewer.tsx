import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  return (
    <div
      className={`prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 
      prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
      prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5
      prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
      prose-table:text-xs ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};
