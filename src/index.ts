import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './data-source';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes';
import friendRequestRoutes from './modules/friendRequest/friendRequest.routes';
import chatRoutes from './modules/chat/chat.routes';
import messageRoutes from './modules/message/message.routes';
import userRoutes from './modules/user/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chats', messageRoutes);
app.use('/api/users', userRoutes);

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => console.log(error));
