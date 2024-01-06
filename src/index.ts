// src/index.ts
import express from 'express';
import router from './Routes/Routes'

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
