import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let tasksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksService }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET /tasks', async () => {
    const result = [{ id: 1, title: 'Task A', description: 'Desc A' }];
    tasksService.findAll.mockResolvedValue(result);

    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(result);
  });

  it('/GET /tasks/:id', async () => {
    const task = { id: 1, title: 'One', description: 'D' };
    tasksService.findOne.mockResolvedValue(task);

    return request(app.getHttpServer())
      .get('/tasks/1')
      .expect(200)
      .expect(task);
  });

  it('/POST /tasks', async () => {
    const dto: CreateTaskDto = { title: 'New', description: 'New D' };
    const created = { id: 1, ...dto };
    tasksService.create.mockResolvedValue(created);

    return request(app.getHttpServer())
      .post('/tasks')
      .send(dto)
      .expect(201)
      .expect(created);
  });

  it('/PUT /tasks/:id', async () => {
    const dto: UpdateTaskDto = { title: 'Updated', description: 'Updated D' };
    const updated = { id: 1, ...dto };
    tasksService.update.mockResolvedValue(updated);

    return request(app.getHttpServer())
      .put('/tasks/1')
      .send(dto)
      .expect(200)
      .expect(updated);
  });

  it('/DELETE /tasks/:id', async () => {
    tasksService.remove.mockResolvedValue(true);

    return request(app.getHttpServer())
      .delete('/tasks/1')
      .expect(200)
      .expect(() => true);
  });
});
