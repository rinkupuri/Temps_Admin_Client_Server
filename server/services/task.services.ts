import { PrismaClient } from "@prisma/client";
import { TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateTaskDTO {
  taskDesc: string;
  assignedById: string;
  assignedToId: string;
  tatDate: Date;
  taskStatus?: TaskStatus;
  taskPriority?: TaskPriority;
  taskRemarks?: string;
}

interface UpdateTaskDTO {
  taskDesc?: string;
  assignedById?: string;
  assignedToId?: string;
  tatDate?: Date;
  taskStatus?: TaskStatus;
  taskPriority?: TaskPriority;
  taskRemarks?: string;
}

class TaskService {
  // Create a new task
  async createTask(taskData: CreateTaskDTO) {
    return await prisma.employeTask.create({
      data: {
        taskDesc: taskData.taskDesc,
        assignedById: taskData.assignedById,
        assignedToId: taskData.assignedToId,
        tatDate: taskData.tatDate,
        taskStatus: taskData.taskStatus || TaskStatus.PENDING,
        taskPriority: taskData.taskPriority || TaskPriority.MEDIUM,
        taskRemarks: taskData.taskRemarks || "",
      },
    });
  }

  // Update a task
  async updateTask(taskId: string, updateData: UpdateTaskDTO) {
    return await prisma.employeTask.update({
      where: { id: taskId },
      data: updateData,
    });
  }
}

export default new TaskService();
