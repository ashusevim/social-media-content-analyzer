require('dotenv').config();
const createApp = require('./app');

const PORT = process.env.PORT || 5001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
