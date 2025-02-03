import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// action：记录用户操作类型，如 LOGIN、ROLE_CHANGE、DELETE_USER 等。
// userId：记录操作的用户 ID。
// details：可选字段，记录详细信息，如变更前后的数据。
// timestamp：自动存储操作时间。

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  userId: number;

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn()
  timestamp: Date;
}
