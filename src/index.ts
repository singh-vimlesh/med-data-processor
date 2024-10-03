import app from './app';
import { config } from './config/appConfig';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
