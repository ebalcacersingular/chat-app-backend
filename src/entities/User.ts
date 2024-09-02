import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { Chat } from './Chat';
import { FriendRequest } from './FriendRequest';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './Message';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @Length(4, 20)
  username: string;

  @Column()
  @Length(8, 100)
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Chat, (chat) => chat.participants)
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedRequests: FriendRequest[];

  @BeforeInsert()
  generateUid() {
    this.uid = uuidv4();  // Generate UID on user creation
  }
}
