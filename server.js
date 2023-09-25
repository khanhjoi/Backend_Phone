import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 8080;
var CorsOpt = {
  origin: 'http://localhost:8001'
}

// config middleware
app.use(cors(CorsOpt));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// router
import productRouter from './routes/productRouter.js';
import providerRouter from './routes/ProviderRouter.js';

app.use('/api/v1/phone', productRouter);
app.use('/api/v1/provider', providerRouter);

app.get("/" , (req, res) => {
  res.json("hello from api");
})

// start server
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
})