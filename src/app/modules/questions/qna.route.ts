import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { QnaController } from './qna.controller';
import { qnaValidation } from './qna.validation';

const router = express.Router();

// Create Question - POST (requires auth)
router.post(
  '/',
  auth(),
  validateRequest(qnaValidation.createQuestionValidation),
  QnaController.createQuestion,
);

// Get All Questions - GET (public)
router.get('/', QnaController.getAllQuestions);

// Get Questions By Product ID - GET (public)
router.get('/product/:productId', QnaController.getQuestionsByProductId);

// Get Question By ID - GET (public)
router.get('/:id', QnaController.getQuestionById);

// Update Question - PATCH (requires auth)
router.patch(
  '/:id',
  auth(),
  validateRequest(qnaValidation.updateQuestionValidation),
  QnaController.updateQuestion,
);

// Delete Question - DELETE (requires auth)
router.delete('/:id', auth(), QnaController.deleteQuestion);

// Create Answer - POST (requires auth)
router.post(
  '/:questionId/answers',
  auth(),
  validateRequest(qnaValidation.createAnswerValidation),
  QnaController.createAnswer,
);

// Get Answers By Question ID - GET (public)
router.get('/:questionId/answers', QnaController.getAnswersByQuestionId);

// Update Answer - PATCH (requires auth)
router.patch(
  '/answers/:id',
  auth(),
  validateRequest(qnaValidation.updateAnswerValidation),
  QnaController.updateAnswer,
);

// Delete Answer - DELETE (requires auth)
router.delete('/answers/:id', auth(), QnaController.deleteAnswer);

export const QnaRoutes = router;
