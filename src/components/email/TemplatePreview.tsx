// src/components/email/TemplatePreview.tsx
'use client';

import { useCallback } from 'react';

interface TemplatePreviewProps {
  html: string;
  variables: Record<string, string>;
}

export default function TemplatePreview({ html, variables }) {
  const renderPreview = useCallback(() => {
    let preview = html;
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  }, [html, variables]);

  return (
    <div className="border rounded-lg p-4">
      <div className="bg-gray-100 p-2 mb-4 rounded">
        <h3 className="font-medium">Preview</h3>
      </div>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: renderPreview() }} 
      />
    </div>
  );
}