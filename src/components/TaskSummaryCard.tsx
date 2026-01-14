// components/TaskSummaryCard.tsx
function SummaryItem({
  label,
  value,
  color = "text-gray-800",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export function TaskSummaryCard({ title, summary }: any) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border shadow-md p-6 rounded-2xl">
      <p className="text-sm text-gray-500 mb-4 text-center">{title}</p>

      <div className="grid grid-cols-4 gap-6 text-center">
        <SummaryItem label="Total" value={summary?.total_tasks} />
        <SummaryItem label="To Do" value={summary?.todo_tasks} color="text-blue-600" />
        <SummaryItem label="In Progress" value={summary?.in_progress_tasks} color="text-yellow-600" />
        <SummaryItem label="Completed" value={summary?.completed_tasks} color="text-green-600" />
      </div>
    </div>
  );
}
