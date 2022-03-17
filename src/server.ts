import app from './app';
import socketServer from './socket';
import { createServer } from "http";
import dotenv from 'dotenv';
dotenv.config();

const httpServer = createServer(app);
socketServer(httpServer);
const port = 8000;

try {
    httpServer.listen(process.env.PORT || port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}