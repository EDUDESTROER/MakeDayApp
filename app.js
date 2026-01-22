import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';

import errorRouter from './routes/error.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js'
import workspaceRouter from './routes/workspace.js';
import notFoundRouter from './routes/not-found.js';

const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

const RedisStore = connectRedis(session);

app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: "sess:"
  }),
  secret: 'BobaFettTop1Bjs',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,   // true se HTTPS
    httpOnly: true
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: '10.0.0.11'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
//app.use(helmet());
app.use(helmet({
    contentSecurityPolicy: false  // útil para ambientes de desenvolvimento
}));
app.use(morgan('dev'));

app.use('/error', errorRouter);
app.use('/not-found', notFoundRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/workspace', workspaceRouter);

app.set('view engine', 'ejs');

app.get('/', (req, res)=>{

  res.status(200).render('index');

});

app.use((req, res)=>{

  res.status(404).redirect('/not-found');

});

app.use((err, req, res, next)=>{

  console.error(err.stack);
  //res.status(500).redirect('/error');

});

app.listen(PORT, '0.0.0.0', ()=>{

  console.log(`Servidor rodando em http://localhost:${PORT}`);

});