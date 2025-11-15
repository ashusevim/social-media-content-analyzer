import { type DragEvent, type KeyboardEvent, useCallback, useRef, useState } from 'react';

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB to mirror API limit

type DropZoneProps = {
  disabled?: boolean;
  onFilesAdded: (files: File[]) => void;
  onRejected?: (message: string) => void;
};

const readableLimit = `${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`;

export function DropZone({ disabled, onFilesAdded, onRejected }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const accepted: File[] = [];

      Array.from(files).forEach((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          onRejected?.(`Unsupported file type: ${file.name}`);
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          onRejected?.(`${file.name} is larger than ${readableLimit}.`);
          return;
        }

        accepted.push(file);
      });

      if (accepted.length) {
        onFilesAdded(accepted);
      }
    },
    [onFilesAdded, onRejected],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled) return;
      setIsDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [disabled, handleFiles],
  );

  const handleDrag = useCallback((event: DragEvent<HTMLDivElement>, active: boolean) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragActive(active);
  }, [disabled]);

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div
      className={`dropzone ${isDragActive ? 'dropzone--active' : ''} ${disabled ? 'dropzone--disabled' : ''}`}
      onDrop={handleDrop}
      onDragOver={(event) => handleDrag(event, true)}
      onDragLeave={(event) => handleDrag(event, false)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={openFilePicker}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(event) => handleFiles(event.target.files)}
        disabled={disabled}
      />
      <div className="dropzone__content">
        <p className="dropzone__title">Drag & drop PDFs or images</p>
        <p className="dropzone__subtitle">or click to select files · up to 5 files · max {readableLimit} each</p>
      </div>
    </div>
  );
}
