type TextPreviewProps = {
  text: string;
};

export function TextPreview({ text }: TextPreviewProps) {
  if (!text) return null;

  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Extracted text</h3>
        <span className="panel__hint">Review & edit before posting</span>
      </div>
      <pre className="text-preview">{text}</pre>
    </div>
  );
}
