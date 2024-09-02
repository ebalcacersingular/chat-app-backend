import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentRequests)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedRequests)
  receiver: User;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;
}
