import { Router } from 'express';
import multer from 'multer';
import adminAuthMiddleware from './app/middlewares/adminAuth';
import AdminSessionController from './app/controllers/AdminSessionController';
import AdminController from './app/controllers/AdminController';
import UserController from './app/controllers/UserController';
import userAuthMiddleware from './app/middlewares/userAuth';
import CategoryController from './app/controllers/CategoryController';
import TypeController from './app/controllers/TypeController';
import MaterialController from './app/controllers/MaterialController';
import PostController from './app/controllers/PostController';
import UserSessionController from './app/controllers/UserSessionController';
import TotalPostsController from './app/controllers/TotalPostsController';
import categoryImage from './app/middlewares/categoryImage';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/test', upload.array('stepCover'), (req, res) => res.json(req.files));

// Admin Session
routes.post('/admin/create-session', AdminSessionController.store);

// User Session
routes.post('/create-session', UserSessionController.store);

// Admin
routes.post('/admin/create-admin', adminAuthMiddleware, AdminController.store);
routes.get('/admin/list-admin', adminAuthMiddleware, AdminController.index);
routes.get('/admin/show-admin/:id', adminAuthMiddleware, AdminController.show);
routes.put('/admin/update-admin', adminAuthMiddleware, AdminController.update);
routes.delete('/admin/delete-admin', adminAuthMiddleware, AdminController.delete);

// User
routes.post('/create-user', UserController.store);
routes.get('/admin/list-user', adminAuthMiddleware, UserController.index);
routes.get('/show-user/:id', UserController.show);
routes.put('/update-user', userAuthMiddleware, UserController.update);
routes.delete('/delete-user', userAuthMiddleware, UserController.delete);

// Category
routes.post('/admin/create-category', adminAuthMiddleware, upload.single('cover'), categoryImage, CategoryController.store);
routes.get('/list-category', CategoryController.index);
routes.get('/show-category/:id', CategoryController.show);
routes.put('/admin/update-category/:id', adminAuthMiddleware, CategoryController.update);
routes.delete('/admin/delete-category', adminAuthMiddleware, CategoryController.delete);

// Type
routes.post('/admin/create-type', adminAuthMiddleware, TypeController.store);
routes.get('/list-type', TypeController.index);
routes.get('/admin/show-type/:id', adminAuthMiddleware, TypeController.show);
routes.put('/admin/update-type/:id', adminAuthMiddleware, TypeController.update);
routes.delete('/admin/delete-type', adminAuthMiddleware, TypeController.delete);

// Material
routes.post('/create-material', userAuthMiddleware, MaterialController.store);
routes.post('/admin/create-material', adminAuthMiddleware, MaterialController.store);
routes.get('/list-material', MaterialController.index);
routes.get('/admin/show-material/:id', adminAuthMiddleware, MaterialController.show);
routes.put('/admin/update-material/:id', adminAuthMiddleware, MaterialController.update);
routes.delete('/admin/delete-material', adminAuthMiddleware, MaterialController.delete);

// Post
routes.post('/create-post', userAuthMiddleware, PostController.store);
routes.get('/list-post', PostController.index);
routes.get('/show-post/:id', PostController.show);
routes.put('/update-post/:id', userAuthMiddleware, PostController.update);
routes.delete('/delete-post', userAuthMiddleware, PostController.delete);
routes.get('/count-post', TotalPostsController.show);

export default routes;
