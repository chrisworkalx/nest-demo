import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from './role.enum';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  //   默认新注册的用户是 USER 角色，管理员可以手动修改数据库里的角色。
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
