type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export default function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="border-b border-gray-200 px-5 py-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p className="mt-4 text-3xl font-medium tracking-tight text-gray-950">
        {value}
      </p>

      {helper && <p className="mt-2 text-xs text-gray-400">{helper}</p>}
    </div>
  );
}
