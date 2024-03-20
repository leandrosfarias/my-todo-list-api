// src/index.ts
import express from 'express';
import router from './Routes/Routes'

const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
