type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export default function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>

      {helper && <p className="mt-2 text-xs text-gray-400">{helper}</p>}
    </div>
  );
}
