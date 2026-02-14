import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.createBlogIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog Post created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getAllBlogsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Posts retrieved successfully',
    data: result,
  });
});

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServices.getBlogByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Post retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServices.updateBlogIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Post updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServices.deleteBlogFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Post deleted successfully',
    data: result,
  });
});

export const BlogControllers = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
