import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
// import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
  ) { }

  async getAllTasks() {
    const tasks = await this.taskModel.find();
    return tasks;
  }

  async getFilteredTask(filterDto: GetTaskFilterDto) {
    const { status, search } = filterDto;

    let tasks = await this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
    }

    return tasks;
  }

  async getOneTask(id: string) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with the id "${id}" not found . `);
    }

    return task;
  }

  async creatTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const newTask = new this.taskModel({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    const result = await newTask.save();
    console.log(result);
    return 'task';
  }

  async updateTaskStatus(status: TaskStatus, id: string) {
    const task = await this.getOneTask(id);
    task.status = status
    task.save();
  }

  async deleteTask(id: string) {
    const found = await this.taskModel.deleteOne({ _id: id });
    if (found.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }
}
