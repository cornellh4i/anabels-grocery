export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Card({ className = "", children }: CardProps) {
  return (
    <div className={`flex w-full max-w-[568px] flex-col items-start gap-[18px] rounded-lg border border-border bg-white px-[35px] py-[30px] text-black ${className}`}>
      {children}
    </div>
  );
}
