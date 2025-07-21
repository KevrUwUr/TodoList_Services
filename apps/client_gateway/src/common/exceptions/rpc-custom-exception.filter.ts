import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const { status, message } = rpcError as {
        status: number | string;
        message: string;
      };

      // Si status es numérico válido, usarlo; sino 400
      const statusCode =
        typeof status === 'number' && status >= 100 && status <= 599
          ? status
          : isNaN(+status)
            ? 400
            : +status;

      return response.status(statusCode).json({
        statusCode,
        status: status,
        message,
      });
    }

    Logger.error('Using fallback response');
    Logger.error('RPC Exception:', rpcError);
    response.status(400).json({
      statusCode: 400,
      message: rpcError,
      error: 'Bad Request',
    });
  }
}
