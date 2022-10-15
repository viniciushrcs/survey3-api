import app from './config/app';
import { MongoHelper } from '../infra/db/mongodb/helpers';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const PORT = env.port;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
