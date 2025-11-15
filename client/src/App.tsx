import { useMemo, useState } from 'react';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { TextPreview } from './components/TextPreview';
import type { AnalyzeResponse } from './types/analysis';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001';
const MAX_FILES = 5;

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const notifyError = (message: string) => {
    setError(message);
    setStatus('');
  };

  const handleFilesAdded = (incoming: File[]) => {
    if (!incoming.length) return;

    let resetError = false;

    setFiles((prev) => {
      const availableSlots = MAX_FILES - prev.length;
      if (availableSlots <= 0) {
        notifyError(`Limit reached: only ${MAX_FILES} files per batch.`);
        return prev;
      }

      const nextFiles = [...prev];
      incoming.slice(0, availableSlots).forEach((file) => {
        const exists = nextFiles.some((current) => current.name === file.name && current.size === file.size);
        if (!exists) {
          nextFiles.push(file);
          resetError = true;
        }
      });

      return nextFiles;
    });

    if (resetError) {
      setError('');
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAnalyze = async () => {
    if (!files.length) {
      notifyError('Add at least one PDF or image to analyze.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setStatus('Uploading files…');

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Unable to analyze files.' }));
        throw new Error(payload.message || 'Unable to analyze files.');
      }

      const payload: AnalyzeResponse = await response.json();
      setAnalysis(payload);
      setStatus('Analysis complete. Review the insights below.');
    } catch (fetchError) {
      notifyError(fetchError instanceof Error ? fetchError.message : 'Unexpected error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setAnalysis(null);
    setError('');
    setStatus('');
  };

  const handleRejected = (message: string) => notifyError(message);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Social Media Content Analyzer</p>
          <h1>Upload content, extract text, and boost engagement.</h1>
          <p className="lead">
            Drop campaign PDFs or scanned creative. We run OCR, extract messaging, and provide tactical
            suggestions to improve reach and conversions.
          </p>
        </div>
        <div className="hero__stats">
          <div>
            <span>Total files</span>
            <strong>{files.length}</strong>
          </div>
          <div>
            <span>Combined size</span>
            <strong>{(totalSize / (1024 * 1024)).toFixed(2)} MB</strong>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="layout__column">
          <DropZone disabled={isProcessing || files.length >= MAX_FILES} onFilesAdded={handleFilesAdded} onRejected={handleRejected} />
          <FileList files={files} onRemove={handleRemoveFile} />

          {(error || status) && (
            <div className={`alert ${error ? 'alert--error' : 'alert--info'}`}>
              {error || status}
            </div>
          )}

          <div className="actions">
            <button className="ghost-button" onClick={handleReset} disabled={!files.length && !analysis}>
              Reset
            </button>
            <button className="primary-button" onClick={handleAnalyze} disabled={isProcessing || !files.length}>
              {isProcessing ? 'Analyzing…' : 'Analyze files'}
            </button>
          </div>
        </section>

        <section className="layout__column">
          {analysis ? (
            <>
              <SuggestionsPanel summary={analysis.suggestions} />
              <TextPreview text={analysis.extractedText} />
            </>
          ) : (
            <div className="panel panel--empty">
              <h3>Insights will appear here</h3>
              <p>Upload documents to unlock best practices and a clean text output ready for editing.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
