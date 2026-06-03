interface SectionCardProps {
  title: string;
  description: string;
}

export function SectionCard({ title, description }: SectionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="font-light mt-3 leading-7 text-slate-400">{description}</p>
    </article>
  );
}
