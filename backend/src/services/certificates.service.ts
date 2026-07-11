import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { Certificate } from '../entities/certificate.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CertificatesService {
  constructor(private dataSource: DataSource) {}

  async generateAndApprove(internId: number, approverId: number) {
    // Simplified: create cert record, render HTML template, generate QR and PDF via puppeteer in worker
    const certNo = `AADC/${internId}/${Date.now()}`;
    const certDir = process.env.CERT_DIR || './storage/certs';
    fs.mkdirSync(certDir, { recursive: true });
    const qrPath = path.join(certDir, `${certNo}_qr.png`);
    await QRCode.toFile(qrPath, `${process.env.BASE_URL || 'http://localhost:3000'}/verify/${certNo}`);

    // Insert placeholder into database using query runner
    await this.dataSource.query(`INSERT INTO certificates (intern_id, cert_no, status, issued_date, qr_code_path, created_at) VALUES (?, ?, ?, NOW(), ?, NOW())`, [internId, certNo, 'pending', qrPath]);
    // Enqueue job for worker (worker will generate PDF and update record). For simplicity we call a shell script (in prod use BullMQ)
    const workerScript = path.join(__dirname, '..', 'worker', 'generate_cert.sh');
    exec(`bash ${workerScript} ${internId} ${certNo}`, (err) => { if (err) console.error(err); });
    return { certNo };
  }

  async getCertificateFile(certNo: string) {
    const rows = await this.dataSource.query('SELECT file_path FROM certificates WHERE cert_no = ?', [certNo]);
    if (!rows || rows.length === 0) return null;
    return path.resolve(rows[0].file_path);
  }
}
