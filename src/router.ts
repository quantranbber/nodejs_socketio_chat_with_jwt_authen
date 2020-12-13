import { Request, Response, Router } from 'express';
import UserController from './api/user/controller';

const router = Router();
router.get('/', (req: Request, res: Response) => {
  if (req.cookies['jwt-token'] !== undefined) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

router.get('/home', (req: Request, res: Response) => {
  if (req.cookies['jwt-token'] !== undefined) {
    res.sendFile(`${__dirname}/template/html/index.html`);
  } else {
    res.redirect('/login');
  }
});

router.get('/login', (req: Request, res: Response) => {
  res.sendFile(`${__dirname}/template/html/login.html`);
});

router.get('/register', (req: Request, res: Response) => {
  res.sendFile(`${__dirname}/template/html/register.html`);
});

router.post('/user', UserController.create);

router.post('/login', UserController.login);

export default router;
