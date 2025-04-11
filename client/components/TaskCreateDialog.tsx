import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

export default function CreateTaskDialog() {
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskStatus, setTaskStatus] = useState("PENDING");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [tatDate, setTatDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false); // Control popover state

  const handleCreateTask = () => {
    console.log({
      taskDesc,
      assignedTo,
      taskStatus,
      taskPriority,
      tatDate,
    });
    // Call API to create task
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex items-center gap-1">
          <BiPlus size={18} /> Create
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:w-[400px] max-h-[90vh] overflow-y-auto flex flex-col gap-4 p-6">
        <DialogHeader>
          <h1 className="text-lg font-semibold text-center">Create Task</h1>
        </DialogHeader>

        {/* Task Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Task Description</label>
          <Input
            placeholder="Enter task description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
        </div>

        {/* Assigned To */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Assigned To</label>
          <Select onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user_123">John Doe</SelectItem>
              <SelectItem value="user_456">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task Status */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Task Status</label>
          <Select value={taskStatus} onValueChange={setTaskStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="INPROGRESS">In Progress</SelectItem>
              <SelectItem value="REVISED">Revised</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task Priority */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Task Priority</label>
          <Select value={taskPriority} onValueChange={setTaskPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TAT Date Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">TAT Date</label>
          <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between"
                onClick={() => setOpen(true)}
              >
                {tatDate ? format(tatDate, "PPP") : "Select date"}
                <CalendarIcon className="ml-2 h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto z-50 p-0"
              align="start"
              onFocus={(e) => e.stopPropagation()} // Prevents auto-closing
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
              <Calendar
                mode="single"
                selected={tatDate}
                onSelect={(date) => {
                  setTatDate(date as Date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="mt-2 w-full" onClick={handleCreateTask}>
          Create Task
        </Button>
      </DialogContent>
    </Dialog>
  );
}
