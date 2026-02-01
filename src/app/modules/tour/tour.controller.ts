import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { TourServices } from './tour.services';
import { sendResponse } from '../../utils/sendResponse';
import status from 'http-status';
import { ITour } from './tour.interface';

const createTour = catchAsync(async (req: Request, res: Response) => {
   const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map(file => file.path)
   }
   const result = await TourServices.createTour(payload);
   sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'Tour created successfully',
      data: result,
   });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
   const query = req.query
   const result = await TourServices.getAllTours(query as Record<string, string>);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Tours retrieved successfully',
      data: result.data,
      meta: result.meta,
   });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
   const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map(file => file.path)
   }
   const result = await TourServices.updateTour(req.params.id as string, payload);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Tour updated successfully',
      data: result,
   });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await TourServices.deleteTour(id as string);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Tour deleted successfully',
      data: result,
   });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
   const result = await TourServices.getAllTourTypes();
   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tour types retrieved successfully',
      data: result,
   });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
   const tourName = req.body;
   const result = await TourServices.createTourType(tourName);
   sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Tour type created successfully',
      data: result,
   });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const { name } = req.body;
   const result = await TourServices.updateTourType(id as string, name);
   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tour type updated successfully',
      data: result,
   });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await TourServices.deleteTourType(id as string);
   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tour type deleted successfully',
      data: result,
   });
});

export const TourController = {
   createTour,
   createTourType,
   getAllTourTypes,
   deleteTourType,
   updateTourType,
   getAllTours,
   updateTour,
   deleteTour,
};