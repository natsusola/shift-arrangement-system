const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist/web')));

app.listen(3000, () => {
  console.log('Server start at port 3000');
});
