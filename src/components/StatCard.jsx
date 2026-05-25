export default function StatCard({ value, label, icon, bgColor }) {
  return (
    <div className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white ${bgColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-3xl font-semibold tabular-nums text-stone-900">
            {value}
          </p>
          <p className="text-sm text-stone-500">{label}</p>
        </div>
      </div>
    </div>
  );
}