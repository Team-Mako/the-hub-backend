import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/', UserController.store);
routes.post('/session', SessionController.store);
routes.get('/', UserController.index);
routes.get('/:id', UserController.show);
routes.use(authMiddleware);
//! Routes that needs authentication
routes.delete('/', UserController.delete);

export default routes;
