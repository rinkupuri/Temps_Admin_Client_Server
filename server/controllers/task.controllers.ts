import { Request, Response } from "express";
import TaskService from "../services/task.services";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.validations";

class TaskController {
  // Create a new task
  async createTask(req: Request, res: Response): Promise<Response> {
    try {
      // Validate request body
      const validationResult = createTaskSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.format(),
          });
      }
      // @ts-ignore
      const task = await TaskService.createTask(validationResult.data);
      return res
        .status(201)
        .json({
          success: true,
          message: "Task created successfully",
          data: task,
        });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  // Update a task
  async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const { taskId } = req.params;

      // Validate request body
      const validationResult = updateTaskSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.format(),
          });
      }

      const updatedTask = await TaskService.updateTask(
        taskId,
        // @ts-ignore 
        validationResult.data
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Task updated successfully",
          data: updatedTask,
        });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }
}

export default new TaskController();
