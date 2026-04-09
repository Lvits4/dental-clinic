import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export function useClinicalFileUrl(fileId: string | undefined, mimeType: string): string | null {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) {
      setBlobUrl(null);
      return;
    }

    let objectUrl: string | null = null;

    const fetchFile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setBlobUrl(null);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/clinical-files/${fileId}/download`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setBlobUrl(null);
          return;
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch {
        setBlobUrl(null);
      }
    };

    fetchFile();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId, mimeType]);

  return blobUrl;
}

export function useClinicalFileDownloadUrl(fileId: string): (filename: string) => void {
  return (filename: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch(`${API_BASE_URL}/clinical-files/${fileId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        console.error('Error downloading file');
      });
  };
}
