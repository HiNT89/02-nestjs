import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

 async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(dto);
    return this.tasksRepository.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    await this.tasksRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
