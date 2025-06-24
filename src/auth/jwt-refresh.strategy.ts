import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: 'JWT_REFRESH_SECRET',  // Dùng secret khác cho Refresh Token
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
