import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import auth from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 8080;
var CorsOpt = {
  origin: 'http://localhost:8001'
}

// config middleware
app.use(express.json({ limit: '50mb'}));
app.use(cors(CorsOpt));
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: '50mb', extended: true}));

// router
import phoneRouter from './routes/PhoneRouter.js';
import providerRouter from './routes/ProviderRouter.js';
import imageRouter from './routes/image.router.js';
import userRouter from './routes/UserRouter.js'

app.use('/api/v1/phone', phoneRouter);
app.use('/api/v1/provider', auth, providerRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/user', userRouter);

app.get("/" , (req, res) => {
  res.json("hello from api");
})

// start server
app.listen(PORT, () => {
  console.log(`⚡️Server is running in http://localhost:${PORT}`);
})