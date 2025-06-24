import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const dto: CreateTaskDto = { title: 'Test', description: 'Desc' };
    const createdTask = { id: 1, ...dto };

    mockRepository.create.mockReturnValue(createdTask);
    mockRepository.save.mockResolvedValue(createdTask);

    const result = await service.create(dto);
    expect(result).toEqual(createdTask);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(createdTask);
  });

  it('should find all tasks', async () => {
    const tasks = [{ id: 1, title: 'A', description: 'B' }];
    mockRepository.find.mockResolvedValue(tasks);

    const result = await service.findAll();
    expect(result).toEqual(tasks);
  });

  it('should find one task', async () => {
    const task = { id: 1, title: 'A', description: 'B' };
    mockRepository.findOneBy.mockResolvedValue(task);

    const result = await service.findOne(1);
    expect(result).toEqual(task);
  });

  it('should update a task', async () => {
    const updated = { id: 1, title: 'Updated', description: 'Desc' };

    mockRepository.update.mockResolvedValue({ affected: 1 });
    mockRepository.findOneBy.mockResolvedValue(updated);

    const result = await service.update(1, { title: 'Updated' });
    expect(result).toEqual(updated);
  });

  it('should delete a task', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if delete fails', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 0 });
    const result = await service.remove(123);
    expect(result).toBe(false);
  });
});
