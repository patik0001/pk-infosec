require('dotenv').config();

const app = require('./app');
const { ensureStore, filePath } = require('./storage');

const PORT = Number(process.env.PORT || 3001);

ensureStore();

app.listen(PORT, () => {
  console.log(`pk-infosec backend listening on http://localhost:${PORT}`);
  console.log(`Storage file: ${filePath}`);
});
