'use client';

import { useState, useEffect } from 'react';
import { EmailTemplate } from '@/lib/types';

interface TemplateComparisonProps {
  templateAId: string;
  templateBId: string;
}

export default function TemplateComparison({ templateAId, templateBId }: TemplateComparisonProps) {
  const [templateA, setTemplateA] = useState<EmailTemplate | null>(null);
  const [templateB, setTemplateB] = useState<EmailTemplate | null>(null);
  const [sampleData] = useState({
    author: 'John Doe',
    rating: 5,
    content: 'Excellent service! Very professional and prompt.',
    source: 'Google',
    date: new Date().toLocaleDateString()
  });

  useEffect(() => {
    loadTemplates();
  }, [templateAId, templateBId]);

  const loadTemplates = async () => {
    const [responseA, responseB] = await Promise.all([
      fetch(`/api/email/templates/${templateAId}`),
      fetch(`/api/email/templates/${templateBId}`)
    ]);

    const [dataA, dataB] = await Promise.all([
      responseA.json(),
      responseB.json()
    ]);

    setTemplateA(dataA);
    setTemplateB(dataB);
  };

  const renderPreview = (template: EmailTemplate) => {
    let html = template.html;
    Object.entries(sampleData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
    });
    return html;
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Template A */}
      <div className="space-y-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <h3 className="font-medium">Template A</h3>
          <p className="text-sm text-gray-600">{templateA?.name}</p>
        </div>
        <div className="border rounded-lg p-4">
          {templateA ? (
            <>
              <div className="mb-4 p-2 bg-gray-50 rounded">
                <p className="font-medium">Subject:</p>
                <p>{templateA.subject}</p>
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderPreview(templateA)
                }} 
              />
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Loading template...
            </div>
          )}
        </div>
      </div>

      {/* Template B */}
      <div className="space-y-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <h3 className="font-medium">Template B</h3>
          <p className="text-sm text-gray-600">{templateB?.name}</p>
        </div>
        <div className="border rounded-lg p-4">
          {templateB ? (
            <>
              <div className="mb-4 p-2 bg-gray-50 rounded">
                <p className="font-medium">Subject:</p>
                <p>{templateB.subject}</p>
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderPreview(templateB)
                }} 
              />
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Loading template...
            </div>
          )}
        </div>
      </div>

      {/* Comparison Controls */}
      <div className="col-span-2 mt-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Sample Data</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(sampleData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}