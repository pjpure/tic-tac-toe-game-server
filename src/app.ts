import express, { Application } from "express";

import router from './routes';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);


export default app;