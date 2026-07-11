import { Controller, Post, Param, Body, Res, Get } from '@nestjs/common';
import { CertificatesService } from '../services/certificates.service';
import { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certService: CertificatesService) {}

  @Post('approve/:id')
  async approve(@Param('id') id: string, @Body() body) {
    const cert = await this.certService.generateAndApprove(Number(id), body.approverId);
    return { ok: true, cert };
  }

  @Get('download/:certNo')
  async download(@Param('certNo') certNo: string, @Res() res: Response) {
    const file = await this.certService.getCertificateFile(certNo);
    if (!file) return res.status(404).send('Not found');
    return res.sendFile(file);
  }
}
