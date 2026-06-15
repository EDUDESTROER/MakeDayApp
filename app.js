import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import { sessionMiddleware } from './config/session.js';

import errorRouter from './routes/error.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js'
import workspaceRouter from './routes/workspace.js';
import notFoundRouter from './routes/not-found.js';
import meRouter from './routes/me.js';
import categoriesRouter from './routes/categories.js';
import notesRouter from './routes/notes.js';
import settingsRouter from './routes/settings.js';
import dashboardRouter from './routes/profile-dashboard.js';
import achievementsRouter from './routes/achievements.js';

const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: '10.0.0.11'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
//app.use(helmet()); // Use this if it's not a development environment.
app.use(helmet({
    contentSecurityPolicy: false  // useful for development environments
}));
app.use(morgan('dev'));

app.use('/error', errorRouter);
app.use('/not-found', notFoundRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/workspace', workspaceRouter);
app.use('/me', meRouter);
app.use('/categories', categoriesRouter);
app.use('/notes', notesRouter);
app.use('/settings', settingsRouter);
app.use('/profile-dashboard', dashboardRouter);
app.use('/achievements', achievementsRouter);

app.use('/uploads', express.static('uploads'));

app.set("trust proxy", 1)
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{

  res.status(200).render('index');

});

app.use((req, res)=>{

  res.status(404).redirect('/not-found');

});

app.use((err, req, res, next)=>{

  if(err.code === 'EBADCSRFTOKEN'){

    return res.status(422).json({
      gravity: 0,
      error: 'Invalid or expired request.'
    });

  }

  console.error(err.stack);
  res.status(500).redirect('/error');

});

app.listen(PORT, '0.0.0.0', ()=>{

  console.log(`Servidor rodando em http://localhost:${PORT}`);

});