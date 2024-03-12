import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigurationService } from 'src/commons/config/configuration.service';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private configurationService: ConfigurationService,
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const result = bcrypt.compareSync(password, user.password);
    if (!result) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async login(userEntity: User) {
    const { email, roles } = userEntity;
    return {
      email,
      accessToken: this.jwtService.sign({ email, roles }),
      expiresIn: `${this.configurationService.authJwtExpiresIn}s`,
    };
  }
}
