import { Router } from 'express';
import UserController from './app/controllers/UserController';
import UserSessionController from './app/controllers/UserSessionController';
import userAuthMiddleware from './app/middlewares/userAuth';
import adminAuthMiddleware from './app/middlewares/adminAuth';
import CategoryController from './app/controllers/CategoryController';
import TypeController from './app/controllers/TypeController';
import AdminSessionController from './app/controllers/AdminSessionController';
import AdminController from './app/controllers/AdminController';

const routes = new Router();

// User
routes.post('/user', UserController.store);
routes.get('/user/:id', UserController.show);
routes.get('/user', adminAuthMiddleware, UserController.index);
routes.delete('/user', adminAuthMiddleware, UserController.delete);

// User Session
routes.post('/login', UserSessionController.store);

// Admin Session
routes.post('/admin', AdminSessionController.store);

// Admin
routes.post('/admin/create', adminAuthMiddleware, AdminController.store);

// Category
routes.post('/category', adminAuthMiddleware, CategoryController.store);

// Type
routes.post('/type', TypeController.store);

export default routes;
