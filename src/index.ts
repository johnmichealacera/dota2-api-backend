import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/route';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const cors = require('cors');
dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.use(cors({
  origin: process.env.DOTA_SITE,
}));
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log("Server started on port", port)); 
    
  } catch (error) {
    process.exit(1);
  }
};
app.use(express.json());
app.use(routes);

start();