import express, { Router, Request, Response } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
// need to import below two to upload image -> upload is the middleware
// uploadImage is the function
import { upload } from '../middlewares/upload';
import { UserRoutes } from '../modules/user/user.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { ProductRoutes } from '../modules/products/product.route';
import { ReviewRoutes } from '../modules/reviews/reviews.routes';
import { BlogsRoutes } from '../modules/blog/blog.routes';
import { QnaRoutes } from '../modules/questions/qna.route';
import { CartRoutes } from '../modules/cart/cart.routes';

const router: Router = express.Router();

interface ModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: ModuleRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/blogs',
    route: BlogsRoutes,
  },
  {
    path: '/questions',
    route: QnaRoutes,
  },
  {
    path : '/cart',
    route : CartRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

// ROUTER TO UPLOAD IMAGE
/**
 * @method POST
 * @route {baseUrl}/upload
 * @select form-data in postman
 * @set key "image" and select image from your device
 */

export default router;
