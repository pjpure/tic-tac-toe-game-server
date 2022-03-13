import app from './app';
import socketServer from './socket';
import { createServer } from "http";

const httpServer = createServer(app);
socketServer(httpServer);
const port = 8000;

try {
    httpServer.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}