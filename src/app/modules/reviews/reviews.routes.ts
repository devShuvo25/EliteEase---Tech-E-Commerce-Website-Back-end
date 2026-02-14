import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './reviews.controller';
import { reviewValidation } from './reviews.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create Review - POST (requires auth)
router.post(
  '/',
  auth(),
  validateRequest(reviewValidation.createReview),
  ReviewControllers.createReview,
);

// Get All Reviews - GET (public)
router.get('/', ReviewControllers.getAllReviews);

// Get Reviews By Product ID - GET (public)
router.get('/product/:productId', ReviewControllers.getReviewsByProductId);

// Get Review By ID - GET (public)
router.get('/:id', ReviewControllers.getReviewById);

// Update Review - PATCH (requires auth)
router.patch(
  '/:id',
  auth(),
  validateRequest(reviewValidation.updateReview),
  ReviewControllers.updateReview,
);

// Delete Review - DELETE (requires auth)
router.delete('/:id', auth(), ReviewControllers.deleteReview);
// Moderation and helpful-vote endpoints removed (not in current schema)

export const ReviewRoutes = router;
