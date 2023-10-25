import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import auth from './middleware/auth.js';
import Stripe from 'stripe';

const app = express();
const PORT = process.env.PORT || 8080;
var CorsOpt = {
  origin: 'http://localhost:3000'
}
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

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
// payment online
app.get('/api/v1/create-payment/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLIC_KEY
  })
});
app.post('/api/v1/create-payment', async (req, res)  => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.get("/" , (req, res) => {
  res.json("hello from api");
})

// start server
app.listen(PORT, () => {
  console.log(`⚡️Server is running in http://localhost:${PORT}`);
})