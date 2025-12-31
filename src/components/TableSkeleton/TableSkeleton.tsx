const TableSkeleton = ({ rows = 8 }: { rows?: number }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#ebebeb] bg-white">
      <table className="w-full shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="px-4 py-4">
                <div className="h-3 w-20 rounded bg-gray-200 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border border-[#ebebeb]">
              {Array.from({ length: 7 }).map((_, j) => (
                <td key={j} className="px-4 py-4 border border-[#ebebeb]">
                  <div className="h-3 w-full rounded bg-gray-200 animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
