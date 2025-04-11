import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Task } from "@/types/types";
import { format } from "date-fns";

export const Columns: ColumnDef<Task>[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">
        {format(new Date(row.getValue("createdAt")), "dd-MMM-yyyy HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "taskDesc",
    header: "Task",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("taskDesc")}</div>
    ),
  },
  {
    accessorKey: "assignedById",
    header: "Assigned By",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue("assignedById")}</div>
    ),
  },
  {
    accessorKey: "taskStatus",
    header: "Status",
    cell: ({ row }) => <StatusDropdown row={row} />,
  },
  {
    accessorKey: "taskPriority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("taskPriority")}</div>
    ),
  },
  {
    accessorKey: "tatDate",
    header: "TAT Date",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.getValue("tatDate")), "dd-MMM-yyyy HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "taskRemarks",
    header: "Remarks",
    cell: ({ row }) => <RemarkCell row={row} />,
  },
];

const handleUpdateTaskStatus = (id: string, status: string) => {
  console.log(`Updating task ${id} to status: ${status}`);
  // API call logic here
};

const updateRemark = (id: string, newRemark: string) => {
  console.log("Updating remark for ID:", id, "New Remark:", newRemark);
  // API call logic here
};

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "border-yellow-500";
    case "INPROGRESS":
      return "border-blue-500";
    case "REVISED":
      return "border-orange-500";
    case "COMPLETED":
      return "border-green-500";
    default:
      return "border-gray-300";
  }
};

const StatusDropdown = ({ row }: { row: any }) => {
  const [status, setStatus] = useState(row.getValue("taskStatus"));

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    handleUpdateTaskStatus(row.original.id, newStatus);
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={`w-[120px] border-2 text-xs sm:text-sm ${getStatusBorderColor(
          status
        )}`}
      >
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="INPROGRESS">In Progress</SelectItem>
        <SelectItem value="REVISED">Revised</SelectItem>
        <SelectItem value="COMPLETED">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};

const RemarkCell = ({ row }: { row: any }) => {
  const [remark, setRemark] = useState(row.getValue("taskRemarks") || "");

  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(e.target.value);
  };

  const handleRemarkUpdate = () => {
    updateRemark(row.original.id, remark);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={remark}
        onChange={handleRemarkChange}
        className="w-28 sm:w-40 text-xs sm:text-sm"
      />
      <Button
        onClick={handleRemarkUpdate}
        className="bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 text-xs sm:text-sm"
      >
        Save
      </Button>
    </div>
  );
};

export default RemarkCell;
