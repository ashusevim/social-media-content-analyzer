type FileListProps = {
  files: File[];
  onRemove: (index: number) => void;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export function FileList({ files, onRemove }: FileListProps) {
  if (!files.length) return null;

  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Queued files ({files.length})</h3>
        <span className="panel__hint">PDF · PNG · JPG · WEBP</span>
      </div>
      <ul className="file-list">
        {files.map((file, index) => (
          <li className="file-list__item" key={`${file.name}-${index}`}>
            <div>
              <p className="file-list__name">{file.name}</p>
              <span className="file-list__meta">
                {file.type || 'unknown'} · {formatSize(file.size)}
              </span>
            </div>
            <button type="button" className="ghost-button" onClick={() => onRemove(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
