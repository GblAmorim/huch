import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageContainer({ title, description, children }: Props) {
  return (
    <main className="container mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </main>
  );
}
