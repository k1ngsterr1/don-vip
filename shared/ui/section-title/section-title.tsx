interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

export default function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center mb-3">
      <span className="mr-2 text-lg">{icon}</span>
      <h2 className="text-[20px] font-medium text-dark font-unbounded">
        {title}
      </h2>
    </div>
  );
}
