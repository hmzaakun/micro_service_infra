import express from 'express';
import commentRouter from './commentController';

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use(commentRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
