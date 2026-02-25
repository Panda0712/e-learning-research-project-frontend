type Props = {
  status: "Active" | "Pending" | "Rejected";
};

const StatusBadge: React.FC<Props> = ({ status }) => {
  let styles = "";
  let dotColor = "";

  switch (status) {
    case "Active":
      styles = "bg-green-100 text-green-700";
      dotColor = "bg-green-500";
      break;
    case "Pending":
      styles = "bg-yellow-100 text-yellow-700";
      dotColor = "bg-yellow-500";
      break;
    case "Rejected":
      styles = "bg-red-100 text-red-700";
      dotColor = "bg-red-500";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dotColor}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
