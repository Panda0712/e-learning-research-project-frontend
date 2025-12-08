import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`grid min-h-screen bg-gray-100 duration-300 ${
        open ? "grid-cols-[240px_1fr]" : "grid-cols-[80px_1fr]"
      }`}
    >
      <DashboardSidebar open={open} setOpen={setOpen} />

      <main className="p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
