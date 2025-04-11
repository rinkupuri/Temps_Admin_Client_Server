"use client";

// import { Button } from "@/components/ui/button";
// import React from "react";
import { BiPlus } from "react-icons/bi";

// const Page = () => {
//   return (
//     <div className="flex w-full justify-center h-screen">
//       <div className="flex justify-between w-11/12 h-fit mt-10 items-center">
//         <h1>Employ Task Managemnt</h1>
//         <Button>
//           <BiPlus size={15} /> Create
//         </Button>
//       </div>
//       <div className="flex"></div>
//     </div>
//   );
// };

// export default Page;

import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Columns } from "@/app/(pages)/employe-task/Columns";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateTaskDialog from "@/components/TaskCreateDialog";

export default function TaskTable() {
  const [data, setData] = useState<Task[]>([]);
  const { data: tasks } = {
    data: [
      {
        id: "1",
        createdAt: "2025-02-20T10:30:00Z",
        taskDesc: "Fix login authentication issue",
        assignedById: "user_123",
        assignedToId: "user_456",
        taskStatus: "PENDING",
        taskPriority: "HIGH",
        tatDate: "2025-02-22T00:00:00Z",
        tatTime: "2025-02-22T18:00:00Z",
        taskRemarks: "Pending review",
      },
      {
        id: "2",
        createdAt: "2025-02-19T14:45:00Z",
        taskDesc: "Update user role permissions",
        assignedById: "user_789",
        assignedToId: "user_321",
        taskStatus: "INPROGRESS",
        taskPriority: "MEDIUM",
        tatDate: "2025-02-21T00:00:00Z",
        tatTime: "2025-02-21T15:30:00Z",
        taskRemarks: "Needs testing",
      },
      {
        id: "3",
        createdAt: "2025-02-18T09:15:00Z",
        taskDesc: "Optimize database queries",
        assignedById: "user_654",
        assignedToId: "user_987",
        taskStatus: "REVISED",
        taskPriority: "HIGH",
        tatDate: "2025-02-20T00:00:00Z",
        tatTime: "2025-02-20T12:00:00Z",
        taskRemarks: "In progress",
      },
      {
        id: "4",
        createdAt: "2025-02-17T16:00:00Z",
        taskDesc: "Design new dashboard UI",
        assignedById: "user_159",
        assignedToId: "user_753",
        taskStatus: "PENDING",
        taskPriority: "LOW",
        tatDate: "2025-02-23T00:00:00Z",
        tatTime: "2025-02-23T17:00:00Z",
        taskRemarks: "Awaiting feedback",
      },
      {
        id: "5",
        createdAt: "2025-02-16T11:20:00Z",
        taskDesc: "Resolve API response delay",
        assignedById: "user_852",
        assignedToId: "user_369",
        taskStatus: "COMPLETED",
        taskPriority: "MEDIUM",
        tatDate: "2025-02-18T00:00:00Z",
        tatTime: "2025-02-18T14:00:00Z",
        taskRemarks: "Completed",
      },
    ],
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (tasks) {
      // @ts-ignore 
      setData(tasks);
    }
  }, []);

  const table = useReactTable({
    data,
    columns: Columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex w-full justify-center items-center">
      <div className="w-11/12">
        <div className="flex justify-between w-11/12 h-fit mt-10 items-center">
          <h1>Employe Task</h1>
          <CreateTaskDialog/>
        </div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter tasks..."
            value={
              (table.getColumn("taskDesc")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("taskDesc")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={Columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
