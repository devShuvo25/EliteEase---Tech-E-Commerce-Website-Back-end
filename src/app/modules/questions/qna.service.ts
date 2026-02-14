import prisma from '../../utils/prisma';
import { Prisma, Question, Answer } from '@prisma/client';

const createQuestion = async (
  userId: string,
  content: string,
  productId: string,
  isPublished = false,
): Promise<Question> => {
  const result = await prisma.question.create({
    data: {
      userId,
      content,
      productId,
      isPublished,
    },
  });
  return result;
};

const getAllQuestions = async (includeAnswers = false): Promise<Question[]> => {
  const result = await prisma.question.findMany({
    include: includeAnswers ? { answers: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getQuestionById = async (
  id: string,
  includeAnswers = true,
): Promise<Question | null> => {
  const result = await prisma.question.findUnique({
    where: { id },
    include: includeAnswers ? { answers: true } : undefined,
  });
  return result;
};

const getQuestionsByProductId = async (
  productId: string,
  includeAnswers = false,
): Promise<Question[]> => {
  const result = await prisma.question.findMany({
    where: { productId },
    include: includeAnswers ? { answers: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getQuestionsByUserId = async (userId: string): Promise<Question[]> => {
  const result = await prisma.question.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const updateQuestion = async (
  id: string,
  data: { content?: string; isPublished?: boolean },
): Promise<Question> => {
  const result = await prisma.question.update({
    where: { id },
    data,
  });
  return result;
};

const deleteQuestion = async (id: string): Promise<Question> => {
  const result = await prisma.question.delete({
    where: { id },
  });
  return result;
};

const createAnswer = async (
  userId: string,
  questionId: string,
  content: string,
): Promise<Answer> => {
  const result = await prisma.answer.create({
    data: {
      userId,
      questionId,
      content,
    },
  });
  return result;
};

const getAnswersByQuestionId = async (
  questionId: string,
): Promise<Answer[]> => {
  const result = await prisma.answer.findMany({
    where: { questionId },
    orderBy: { createdAt: 'asc' },
  });
  return result;
};

const updateAnswer = async (
  id: string,
  data: { content?: string },
): Promise<Answer> => {
  const result = await prisma.answer.update({
    where: { id },
    data,
  });
  return result;
};

const deleteAnswer = async (id: string): Promise<Answer> => {
  const result = await prisma.answer.delete({
    where: { id },
  });
  return result;
};

export const QnaService = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionsByProductId,
  getQuestionsByUserId,
  updateQuestion,
  deleteQuestion,
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
};
