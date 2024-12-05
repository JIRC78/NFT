const express = require('express');
const app = express();
 
const saleRouters = require('../routers/sales');
const bodyParser = require('body-parser');
const userRouter = require('../routers/users');
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
app.use('/api', saleRouters);
app.use('/api', userRouter);
 
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));