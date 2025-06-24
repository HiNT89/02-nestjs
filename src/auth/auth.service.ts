import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');
    // remove password from user object
    const result  = { id : user.id, username: user.username };
    return result
  }

  // Tạo JWT Access Token và Refresh Token
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const accessTokenPayload = { sub: user.id, username: user.username };
    const refreshTokenPayload = { sub: user.id, username: user.username };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '15m', // Hết hạn trong 15 phút
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d', // Hết hạn trong 7 ngày
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  // Đổi mới Access Token bằng Refresh Token
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user) throw new UnauthorizedException('User not found');

      const accessTokenPayload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn: '15m',
      });

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async register(username: string, password: string) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) throw new UnauthorizedException('Username taken');
    return this.usersService.create(username, password);
  }

  async logout(refreshToken: string) {
    // Nếu bạn lưu Refresh Token vào cơ sở dữ liệu, bạn có thể xóa nó ở ì 
    return { message: 'Logged out successfully' };
  }
}
