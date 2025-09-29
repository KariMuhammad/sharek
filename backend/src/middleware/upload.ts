import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { CustomError } from './errorHandler';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = config.ALLOWED_FILE_TYPES;
  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new CustomError(`File type .${fileExtension} is not allowed`, 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
});

export const uploadSingle = (fieldName: string) => {
  return upload.single(fieldName);
};

export const uploadMultiple = (fieldName: string, maxCount: number = 5) => {
  return upload.array(fieldName, maxCount);
};

export const uploadFields = (fields: multer.Field[]) => {
  return upload.fields(fields);
};

// Middleware to handle multer errors
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      next(new CustomError('File too large', 400));
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      next(new CustomError('Too many files', 400));
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      next(new CustomError('Unexpected field', 400));
    } else {
      next(new CustomError('File upload error', 400));
    }
  } else {
    next(error);
  }
};
