import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RequestLoginDto } from './dto/request-login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/v1/auth')
@ApiTags('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Autentica na API' })
  @ApiBody({ type: RequestLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Access token',
    type: ResponseLoginDto,
  })
  async login(@Request() req): Promise<{
    email: string;
    accessToken: string;
    expiresIn: string;
  }> {
    return this.authService.login(req.user);
  }
}
