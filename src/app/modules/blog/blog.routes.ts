import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { blogValidation } from './blog.validatioin';
import { BlogControllers } from './blog.controller';

const router = Router();

// Create
router.post(
  '/',
  validateRequest(blogValidation.createBlog),
  BlogControllers.createBlog,
);

// Read all
router.get('/', BlogControllers.getAllBlogs);

// Read one
router.get('/:id', BlogControllers.getBlogById);

// Update
router.patch(
  '/:id',
  validateRequest(blogValidation.updateBlog),
  BlogControllers.updateBlog,
);

// Delete
router.delete('/:id', BlogControllers.deleteBlog);

export const BlogsRoutes = router;
