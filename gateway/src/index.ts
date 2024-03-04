import express from 'express';
import gatewayRouter from './gatewayController'; 

const app = express();
const PORT = process.env.PORT || 4000; 

app.use(express.json());
app.use(gatewayRouter);

app.listen(PORT, () => {
  console.log(`API Gateway running on port :${PORT}`);
});
