import { Check, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import GraphIcon from "../../../../../assets/graph.svg?react";
import Input from "../../../../../components/Input/Input";
import TableSkeleton from "../../../../../components/TableSkeleton/TableSkeleton";
import DashboardCommissionTable from "./DashboardCommissionTable/DashboardCommissionTable";

type DateFilter = "all" | "last-month" | "this-month" | "this-year" | "custom";

export type orderStatus = "received" | "pending";

interface commissionData {
  totalCommission: number;
  received: number;
  pending: number;
}

export interface orderData {
  id: number;
  customerName: string;
  date: Date;
  status: orderStatus;
  price: number;
  commission: number;
}

const mockCommissionData: commissionData = {
  totalCommission: 1000,
  received: 800,
  pending: 200,
};

const mockOrderData: orderData[] = [
  {
    id: 254841,
    customerName: "Dianne Russell",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Bessie Cooper",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Cameron Williamson",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Kathryn Murphy",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Theresa Webb",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Guy Hawkins",
    date: new Date(),
    status: "pending",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Cody Fisher",
    date: new Date(),
    status: "pending",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Savannah Nguyen",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Leslie Alexander",
    date: new Date(),
    status: "pending",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Floyd Miles",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Floyd Miles",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Floyd Miles",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
  {
    id: 254841,
    customerName: "Floyd Miles",
    date: new Date(),
    status: "received",
    price: 100,
    commission: 95,
  },
];

const DashboardCommission = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-year");

  const options = [
    { label: "All Time", value: "all" },
    { label: "Last Month", value: "last-month" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ] as const;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white h-22.5 shadow-md rounded-lg py-4 px-6 flex items-center gap-3">
          <GraphIcon fontSize={24} />
          <div className="flex flex-col">
            <h4 className="font-inter text-[24px] font-semibold text-[#0F172A]">
              ${mockCommissionData.totalCommission}
            </h4>
            <span className="font-inter font-normal text-[14px] text-[#334155]">
              Total Commission
            </span>
          </div>
        </div>
        <div className="bg-white h-22.5 shadow-md rounded-lg py-4 px-6 flex items-center gap-3">
          <GraphIcon fontSize={24} />
          <div className="flex flex-col">
            <h4 className="font-inter text-[24px] font-semibold text-[#0F172A]">
              ${mockCommissionData.received.toFixed(1)}
            </h4>
            <span className="font-inter font-normal text-[14px] text-[#334155]">
              Received
            </span>
          </div>
        </div>
        <div className="bg-white h-22.5 shadow-md rounded-lg py-4 px-6 flex items-center gap-3">
          <GraphIcon fontSize={24} />
          <div className="flex flex-col">
            <h4 className="font-inter text-[24px] font-semibold text-[#0F172A]">
              ${mockCommissionData.pending.toFixed(2)}
            </h4>
            <span className="font-inter font-normal text-[14px] text-[#334155]">
              Pending
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 my-4">
        <Input
          className="text-[14px] text-[#9D9D9D] border border-[#E2E8F0] bg-white"
          variant="outline"
          placeholder="Search"
          rightIcon={<Search size={24} className="mr-3 text-blue-900" />}
        />

        <div
          className="relative rounded-md px-4 py-3 
          flex items-center gap-2 cursor-pointer mr-5"
          onClick={(e) => {
            e.stopPropagation();
            setOpenFilter(!openFilter);
          }}
        >
          <p className="font-semibold text-[14px]">Filter</p>
          <HiBars3BottomRight size={24} />

          {openFilter && (
            <div
              className="absolute -bottom-72 z-100 right-0 min-w-48.5 p-5 shadow-lg rounded-lg bg-white flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-[18px] text-[#475569] font-semibold">
                Date Period
              </h4>
              {options.map((option) => (
                <div
                  key={option.label}
                  className="flex items-center gap-5"
                  onClick={() => {
                    setDateFilter(option.value);
                    // setOpenFilter(false);
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-sm ${
                      dateFilter !== option.value
                        ? "border border-gray-200"
                        : "bg-[#3B82F6]"
                    } flex items-center justify-center`}
                  >
                    {dateFilter === option.value && (
                      <Check className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <p
                    className={`font-semibold text-[14px] ${
                      dateFilter === option.value
                        ? "text-[#3B82F6]"
                        : "text-[#475569]"
                    }`}
                  >
                    {option.label}
                  </p>
                </div>
              ))}

              <p
                className="text-[14px] text-[#3B82F6] font-normal"
                onClick={() => {
                  setDateFilter("custom");
                  // setOpenFilter(false);
                }}
              >
                Custom Range
              </p>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DashboardCommissionTable data={mockOrderData} />
      )}
    </>
  );
};

export default DashboardCommission;
