import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import LoginUserDto from '../../../auth/dto/login-user.dto';
import { AuthService } from '../../../auth/services/auth/auth.service';
import SignUserDto from '../../../auth/dto/sign-user.dto';
import { Public } from '../../../common/decorators/is-public.decorator';
import CreateUserDto from '../../../users/dto/create-user.dto';
import { FastifyRequest } from 'fastify';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import TokenResponse from '../../response/token.response';
import ErrorResponse from '../../../common/dto/error.dto';
import RegisterResp from 'src/auth/response/register.response';
import GetProfileResp from 'src/auth/response/profile.response';

@ApiTags('auth')
@Controller('auth')
@ApiInternalServerErrorResponse({
  type: () => ErrorResponse,
  description: 'Something went wrong',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: () => TokenResponse, description: 'User logged in' })
  @ApiUnauthorizedResponse({
    type: () => ErrorResponse,
    description: 'Incorrect user`s credentials',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() reqBody: LoginUserDto): Promise<TokenResponse> {
    const token = await this.authService.login(reqBody);

    return token;
  }

  @ApiOkResponse({ type: () => RegisterResp, description: 'User registered' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  async register(@Body() reqBody: CreateUserDto): Promise<RegisterResp> {
    const userId = await this.authService.register(reqBody);

    return {
      user_id: userId,
      ok: true,
    };
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token from login endpoint',
  })
  @ApiOkResponse({ type: () => SignUserDto, description: 'User exist' })
  @ApiUnauthorizedResponse({
    type: () => ErrorResponse,
    description: 'User isn`t authorized',
  })
  @Get('profile')
  getProfile(@Req() req: FastifyRequest): GetProfileResp {
    return {
      user: req.user,
      ok: true,
    };
  }
}
