import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPT = { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] };

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [, base64] = dataUrl.split(',');
      const mimeMatch = (dataUrl.match(/data:(.+);base64/) ?? [])[1];
      resolve({
        base64: base64 ?? '',
        mimeType: mimeMatch?.trim() ?? 'image/jpeg',
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function ProfilePictureGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setResultUrl(null);
    setFile(acceptedFiles[0] ?? null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: loading,
  });

  const handleGenerate = async () => {
    if (!file) {
      setError('Upload a photo first.');
      return;
    }
    setError(null);
    setResultUrl(null);
    setLoading(true);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const base = (import.meta.env.VITE_API_URL ?? '').toString().replace(/\/$/, '');
      const url = base ? `${base}/api/generate-pfp` : '/api/generate-pfp';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const friendlyMessage =
          res.status === 429
            ? 'Quota limit reached. Please try again in 5 minutes.'
            : data.error ?? `Request failed (${res.status})`;
        setError(friendlyMessage);
        return;
      }
      if (data.url) setResultUrl(data.url);
      else setError('No image returned.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!resultUrl) return;
    e.preventDefault();
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ascend-pfp.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const clearAll = () => {
    setFile(null);
    setResultUrl(null);
    setError(null);
    setOverlayOpen(false);
  };

  return (
    <div className="pfp-generator">
      <h3 className="pfp-generator-title">ASCEND pfp generator</h3>
      <p className="pfp-generator-desc">Upload your pfp to ASCEND with everyone else, change your pfp on X to show everyone you have ASCENDED too</p>

      <div className="pfp-upload-area">
        <div
          {...getRootProps()}
          className={`pfp-dropzone ${isDragActive ? 'pfp-dropzone-active' : ''} ${file ? 'pfp-dropzone-has-file' : ''}`}
        >
          <input {...getInputProps()} />
          <span className="pfp-dropzone-text">
            {file ? 'Change photo' : isDragActive ? 'Drop the image here' : 'Drop a photo here or click to choose'}
          </span>
        </div>
        <div className="pfp-actions">
          <button
            type="button"
            className="pfp-btn pfp-btn-generate"
            onClick={handleGenerate}
            disabled={!file || loading}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
          {file && !loading && (
            <button type="button" className="pfp-btn pfp-btn-clear" onClick={clearAll}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="pfp-image-box">
        {loading && (
          <div className="pfp-generating">
            <div className="pfp-generating-dots" />
            <p className="pfp-generating-text">You are being ascended</p>
          </div>
        )}
        {!loading && resultUrl && (
          <button
            type="button"
            className="pfp-result-img-wrap"
            onClick={() => setOverlayOpen(true)}
            aria-label="View full size"
          >
            <img src={resultUrl} alt="Generated profile" className="pfp-result-img" />
          </button>
        )}
        {!loading && !resultUrl && file && previewUrl && (
          <img src={previewUrl} alt="Uploaded" className="pfp-uploaded-img" />
        )}
        {!loading && !resultUrl && !file && (
          <span className="pfp-placeholder">Your photo will appear here</span>
        )}
      </div>

      {!loading && resultUrl && (
        <div className="pfp-result-actions">
          <a
            href={resultUrl}
            onClick={handleDownload}
            className="pfp-btn pfp-btn-download"
          >
            Download
          </a>
          <button type="button" className="pfp-btn pfp-btn-clear" onClick={clearAll}>
            New photo
          </button>
        </div>
      )}

      {error && <p className="pfp-error">{error}</p>}

      {overlayOpen && resultUrl && (
        <div
          className="pfp-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Generated image full size"
          onClick={() => setOverlayOpen(false)}
        >
          <button
            type="button"
            className="pfp-overlay-close"
            onClick={() => setOverlayOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="pfp-overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={resultUrl} alt="Generated profile full size" className="pfp-overlay-img" />
          </div>
        </div>
      )}
    </div>
  );
}
