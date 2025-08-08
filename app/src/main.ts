import { web } from './application/web';

const PORT = process.env.PORT || 8000;
web.listen(PORT, () => {
  console.log(`Listening on ${PORT}!`);
});
