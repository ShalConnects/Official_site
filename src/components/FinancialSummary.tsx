interface Props {
  line1: string;
  line2: string;
  className?: string;
}

export default function FinancialSummary({ line1, line2, className = '' }: Props) {
  return (
    <div className={`rounded-lg border border-gray-700/50 bg-gray-800/50 p-4 ${className}`}>
      <p className="text-gray-500 text-xs mb-1">All-Time Summary</p>
      <p className="text-gray-300 text-sm sm:text-base">{line1}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{line2}</p>
    </div>
  );
}
