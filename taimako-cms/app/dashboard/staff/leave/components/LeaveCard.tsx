import LeaveStatusBadge from './LeaveStatusBadge';

export default function LeaveCard({ leave }: { leave: any }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-3">{leave.staffName}</td>
      <td className="p-3">{leave.startDate}</td>
      <td className="p-3">{leave.endDate}</td>
      <td className="p-3">{leave.reason}</td>
      <td className="p-3">
        <LeaveStatusBadge status={leave.status || 'Pending'} />
      </td>
    </tr>
  );
}
