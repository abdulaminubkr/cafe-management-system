import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn() id: number;
  @Column() intern_id: number;
  @Column({ unique: true }) cert_no: string;
  @Column({ default: 'pending' }) status: string;
  @Column({ nullable: true }) issued_date: Date;
  @Column({ nullable: true }) file_path: string;
  @Column({ nullable: true }) qr_code_path: string;
  @CreateDateColumn() created_at: Date;
}
