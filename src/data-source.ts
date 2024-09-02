import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Message } from './entities/Message';
import { Chat } from "./entities/Chat";
import { FriendRequest } from "./entities/FriendRequest";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'K3CdKsKuPHDbW0Ff',
  database: 'chat_app',
  entities: [
    User,
    Message,
    Chat,
    FriendRequest
  ],
  synchronize: true,
  logging: false,
  migrations: ['src/migration/*.ts']
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
