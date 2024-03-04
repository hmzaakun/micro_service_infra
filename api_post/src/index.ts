import express from 'express';
import postRouter from './postController';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(postRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
