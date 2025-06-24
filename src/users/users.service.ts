import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, password: hashed });
    return this.repo.save(user);
  }

  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
