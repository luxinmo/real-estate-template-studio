interface ComponentBlockProps {
  label: string;
  children: React.ReactNode;
}

const ComponentBlock = ({ label, children }: ComponentBlockProps) => {
  return (
    <div className="space-y-3">
      <div className="component-label">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        {label}
      </div>
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ComponentBlock;
