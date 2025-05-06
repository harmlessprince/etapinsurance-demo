import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();
    console.log(exception);
    const message =
      exception.message ?? 'An error occurred, please try again later';

    const responseBody: any = {
      success: false,
      // statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    // If it's a validation error, include formatted errors
    if (exception instanceof UnprocessableEntityException) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const errorResponse = exception.getResponse() as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      responseBody.message = errorResponse.message || 'Validation failed';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      responseBody.errors = errorResponse.errors;
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      responseBody.message = exception.message;
    }

    response.status(status).json(responseBody);
  }
}
