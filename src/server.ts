import app from './app';

const PORT = process.env.PORT || 3000;

if (!PORT) throw new Error('PORT is not defined');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
