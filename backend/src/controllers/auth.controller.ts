import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const { email, password } = body;
    const tokens = await this.authService.login(email, password);
    // Set httpOnly cookies
    res.cookie('access_token', tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.json({ ok: true });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.json({ ok: true });
  }

  @Get('me')
  async me(@Req() req: Request) {
    return req.user || null;
  }
}
