const app = require('./server');

const { PORT } = process.env || 3001;

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}!`));
