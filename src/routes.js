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
import postImage from './app/middlewares/postImage';
import multerConfig from './config/multer';
import TopCategoriesController from './app/controllers/TopCategoriesController';
import TopMaterialsController from './app/controllers/TopMaterialsController';
import PostMaterialController from './app/controllers/PostMaterialController';
import PostStepController from './app/controllers/PostStepController';
import UpdatePasswordController from './app/controllers/UpdatePasswordController';
import profileImage from './app/middlewares/profileImage';
import stepImage from './app/middlewares/stepImage';
import UpdateAvatarController from './app/controllers/UpdateAvatarController';
import UpdatePostViewsController from './app/controllers/UpdatePostViewsController';
import LikeController from './app/controllers/LikeController';
import FavouriteController from './app/controllers/FavouriteController';
import PostsViewsControllers from './app/controllers/PostsViewsController';
import PostByCategoryController from './app/controllers/PostByCategoryController';
import SearchController from './app/controllers/SearchController';
import CommentController from './app/controllers/CommentController';
import CategoryFilterController from './app/controllers/CategoryFilterController';
import GetIdController from './app/controllers/GetIdController';
import StepController from './app/controllers/StepController';

const routes = new Router();
const upload = multer(multerConfig);

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
routes.put('/update-password', userAuthMiddleware, UpdatePasswordController.update);
routes.put('/update-avatar', userAuthMiddleware, upload.single('avatar'), profileImage, UpdateAvatarController.update);
routes.delete('/delete-user', userAuthMiddleware, UserController.delete);

// Category
routes.post('/admin/create-category', adminAuthMiddleware, upload.single('cover'), categoryImage, CategoryController.store);
routes.get('/list-category', CategoryController.index);
routes.get('/category-post', PostByCategoryController.index);
routes.get('/show-category/:slug', CategoryController.show);
routes.put('/admin/update-category/:id', adminAuthMiddleware, CategoryController.update);
routes.delete('/admin/delete-category', adminAuthMiddleware, CategoryController.delete);
routes.get('/category-filter', CategoryFilterController.index);
routes.get('/count-filter', TotalPostsController.index);

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
routes.post('/create-post', userAuthMiddleware, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'stepCover' }]), postImage, stepImage, PostController.store);
routes.get('/list-post', PostController.index);
routes.get('/show-post/:slug', PostController.show);
routes.put('/update-post/:postId', userAuthMiddleware, upload.fields([{ name: 'cover', maxCount: 1 }]), postImage, PostController.update);
routes.delete('/delete-post', userAuthMiddleware, PostController.delete);
routes.get('/count-post', TotalPostsController.show);
routes.get('/post-material/:postId', PostMaterialController.index);
routes.get('/post-step/:postId', PostStepController.index);
routes.put('/post-view', UpdatePostViewsController.store);
routes.get('/check-like/:postId', userAuthMiddleware, LikeController.show);
routes.put('/post-like/:postId/:giveId', userAuthMiddleware, LikeController.store);
routes.delete('/remove-like/:postId', userAuthMiddleware, LikeController.delete);
routes.put('/post-favourite/:postId', userAuthMiddleware, FavouriteController.store);
routes.delete('/remove-favourite/:postId', userAuthMiddleware, FavouriteController.delete);
routes.get('/check-favourite/:postId', userAuthMiddleware, FavouriteController.show);
routes.get('/favourite-list', userAuthMiddleware, FavouriteController.index);
routes.get('/search', SearchController.index);
routes.get('/get-id', GetIdController.show);
routes.post('/add-step', userAuthMiddleware, upload.fields([{ name: 'stepCover' }]), stepImage, StepController.store);
routes.delete('/delete-step/:stepId', userAuthMiddleware, StepController.delete);
routes.delete('/delete-material', userAuthMiddleware, MaterialController.delete);

// Comments
routes.post('/create-comment', userAuthMiddleware, CommentController.store);
routes.get('/get-comment', CommentController.index);

// Insights
routes.get('/top-categories', userAuthMiddleware, TopCategoriesController.index);
routes.get('/top-materials', userAuthMiddleware, TopMaterialsController.index);
routes.get('/views', userAuthMiddleware, PostsViewsControllers.show);
routes.get('/total-likes', userAuthMiddleware, LikeController.index);
routes.get('/total-comments', userAuthMiddleware, CommentController.show);

export default routes;
