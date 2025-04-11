import { z } from "zod";
import { TaskStatus, TaskPriority } from "@prisma/client";

export const createTaskSchema = z.object({
  taskDesc: z
    .string()
    .min(3, "Task description must be at least 3 characters long"),
  assignedById: z.string().min(1, "Assigned By ID is required"),
  assignedToId: z.string().min(1, "Assigned To ID is required"),
  tatDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  taskStatus: z.nativeEnum(TaskStatus).optional(),
  taskPriority: z.nativeEnum(TaskPriority).optional(),
  taskRemarks: z.string().optional(),
});

export const updateTaskSchema = z.object({
  taskDesc: z
    .string()
    .min(3, "Task description must be at least 3 characters long")
    .optional(),
  assignedById: z.string().optional(),
  assignedToId: z.string().optional(),
  tatDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  taskStatus: z.nativeEnum(TaskStatus).optional(),
  taskPriority: z.nativeEnum(TaskPriority).optional(),
  taskRemarks: z.string().optional(),
});
