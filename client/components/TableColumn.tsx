import { User as UserType } from "@/types/types";
import { PermissionCell } from "@/components/PermissionDropDown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { ColumnDef } from "@tanstack/react-table";

// @ts-ignore
export const Columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },

  {
    accessorKey: "role",
    header: () => <div className="">Role</div>,
    cell: ({ row }) => <div className="flex">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "Permission",
    header: () => <div className="">Permissions</div>,
    cell: ({ row }) => (
      <div className="flex">
        {row?.original?.Permission?.length &&
          row?.original?.Permission?.map((item, index) => (
            <div
              key={index}
              className="bg-green-600 rounded-full text-white text-[12px] px-2 py-1 mx-1"
            >
              {item}
            </div>
          ))}
      </div>
    ),
  },
  {
    accessorKey: "Permission",
    header: () => <div className="">Permission</div>,
    cell: ({ row }) => <PermissionCell user={row.original} />,
  },

  {
    id: "actions",
    header: () => <div className="">Actions</div>,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Block
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
