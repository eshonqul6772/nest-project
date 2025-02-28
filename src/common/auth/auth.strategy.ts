import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersEntity } from '@entities/users.entity';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_KEY'),
    });
  }

  async validate(payload: { id: number }) {
    try {
      const id = payload.id;
      return await this.userRepository.findOne({ where: { id } });
    } catch (err: any) {
      throw new RequestTimeoutException({
        status: 408,
        message: err + ' ' + 'Timed out fetching a new connection from the connection pool!',
        error: true,
      });
    }
  }
}
