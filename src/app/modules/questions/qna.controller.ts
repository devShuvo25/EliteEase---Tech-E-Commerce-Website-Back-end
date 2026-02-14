import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QnaService } from './qna.service';

// Create Question
const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const { content, productId } = req.body;

  const result = await QnaService.createQuestion(userId, content, productId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Question submitted successfully and is pending approval',
    data: result,
  });
});

// Get All Questions
const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const includeAnswers = req.query.includeAnswers === 'true';
  const result = await QnaService.getAllQuestions(includeAnswers);

  // Debug: log and return counts so we can verify whether rows are retrieved
  console.log(`[QnA] getAllQuestions -> count: ${result?.length ?? 0}`);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Questions retrieved successfully',
    data: result,
    meta: {
      page: 1,
      limit: result?.length ?? 0,
      total: result?.length ?? 0,
      totalPage: 1,
    },
  });
});

// Get Question By ID
const getQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QnaService.getQuestionById(id, true);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Question retrieved successfully',
    data: result,
  });
});

// Get Questions By Product ID
const getQuestionsByProductId = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await QnaService.getQuestionsByProductId(productId, true);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Product questions retrieved successfully',
      data: result,
    });
  },
);

// Update Question
const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const { content, isPublished } = req.body;
  const result = await QnaService.updateQuestion(id, { content, isPublished });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Question updated successfully',
    data: result,
  });
});

// Delete Question
const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const result = await QnaService.deleteQuestion(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Question deleted successfully',
    data: result,
  });
});

// Create Answer
const createAnswer = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const questionId = req.params.questionId || req.body.questionId;
  const { content } = req.body;

  const result = await QnaService.createAnswer(userId, questionId, content);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Answer submitted successfully',
    data: result,
  });
});

// Get Answers By Question ID
const getAnswersByQuestionId = catchAsync(
  async (req: Request, res: Response) => {
    const { questionId } = req.params;
    const result = await QnaService.getAnswersByQuestionId(questionId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Answers retrieved successfully',
      data: result,
    });
  },
);

// Update Answer
const updateAnswer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const { content } = req.body;
  const result = await QnaService.updateAnswer(id, { content });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Answer updated successfully',
    data: result,
  });
});

// Delete Answer
const deleteAnswer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const result = await QnaService.deleteAnswer(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Answer deleted successfully',
    data: result,
  });
});

export const QnaController = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionsByProductId,
  updateQuestion,
  deleteQuestion,
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
};
