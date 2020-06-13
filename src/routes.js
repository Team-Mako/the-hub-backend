import { Router } from 'express';
import adminAuthMiddleware from './app/middlewares/adminAuth';
import AdminSessionController from './app/controllers/AdminSessionController';
import AdminController from './app/controllers/AdminController';

const routes = new Router();

// Admin Session
routes.post('/admin/create-session', AdminSessionController.store);

// Admin Panel
routes.post('/admin/create-admin', adminAuthMiddleware, AdminController.store);
routes.get('/admin/list-admin', adminAuthMiddleware, AdminController.index);
routes.get('/admin/show-admin/:id', adminAuthMiddleware, AdminController.show);
routes.put('/admin/update-admin', adminAuthMiddleware, AdminController.update);
routes.delete('/admin/delete-admin', adminAuthMiddleware, AdminController.delete);

export default routes;
