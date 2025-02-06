'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Template {
  id: string;
  name: string;
  subject: string;
  html: string;
  variables: string[];
}

export default function TemplateEditor() {
  const [template, setTemplate] = useState<Template>({
    id: '',
    name: 'Review Notification',
    subject: 'New Review from {{source}}',
    html: '',
    variables: ['author', 'rating', 'content', 'source', 'date']
  });

  const sampleData = {
    author: "John Doe",
    rating: "5",
    content: "Great service!",
    source: "Google",
    date: new Date().toLocaleDateString()
  };

  const handleSave = async () => {
    await fetch(`/api/email/templates/${template.id || 'new'}`, {
      method: template.id ? 'PUT' : 'POST',
      body: JSON.stringify(template)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={template.name}
          onChange={(e) => setTemplate({ ...template, name: e.target.value })}
          className="rounded-md border-gray-300"
          placeholder="Template Name"
        />
        <input
          type="text"
          value={template.subject}
          onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
          className="rounded-md border-gray-300"
          placeholder="Subject Line"
        />
      </div>

      <div className="h-[500px] border rounded-md">
        <Editor
          value={template.html}
          onChange={(value) => setTemplate({ ...template, html: value || '' })}
          language="html"
          theme="vs-light"
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Available variables:</span>
          {template.variables.map(v => (
            <span key={v} className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
              {{{{v}}}}
            </span>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Save Template
        </button>
      </div>
    </div>
  );
}