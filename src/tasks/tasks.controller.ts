import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipes } from './pipes/task-status-validation.pipes';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) { }

  @Get()
  async getTasks(@Query() filterDto: GetTaskFilterDto) {
    if (Object.keys(filterDto).length) {
      const task = await this.taskService.getFilteredTask(filterDto)
      return task;
    } else {
      const task = await this.taskService.getAllTasks();
      return task;
    }
  }

  @Get(':id')
  async getOneTask(@Param('id') id: string) {
    const task = await this.taskService.getOneTask(id);
    return task;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    const result = await this.taskService.creatTask(createTaskDto);
    return { PR: result };
  }

  @Patch(':id')
  async updateTaskStatus(
    @Body('status', TaskStatusValidationPipes) status: TaskStatus,
    @Param('id') id: string) {
    await this.taskService.updateTaskStatus(status, id)
    return null;
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    await this.taskService.deleteTask(id);
    return null;
  }

}
