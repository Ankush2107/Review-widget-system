'use client';

import { useState, useEffect } from 'react';

interface Version {
  id: string;
  html: string;
  subject: string;
  createdAt: string;
  createdBy: string;
}

export default function TemplateVersioning({ templateId }: { templateId: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, [templateId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/email/templates/${templateId}/versions`);
      if (!response.ok) throw new Error('Failed to load versions');
      const data = await response.json();
      setVersions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const previewVersion = async (versionId: string) => {
    try {
      const response = await fetch(`/api/email/templates/${templateId}/versions/${versionId}`);
      if (!response.ok) throw new Error('Failed to load version');
      const data = await response.json();
      setSelectedVersion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load version');
    }
  };

  const rollback = async (versionId: string) => {
    try {
      const response = await fetch(`/api/email/templates/${templateId}/rollback/${versionId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to rollback');
      await loadVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rollback');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Rest of the JSX remains the same */}
    </div>
  );
}