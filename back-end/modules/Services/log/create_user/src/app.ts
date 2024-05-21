import  Express  from "express"
import { config } from "dotenv";

const app = Express();

app.use(Express.json());


export default app;