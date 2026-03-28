import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;

    // Only audit write operations
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap((responseData) => {
          // Audit logging will be handled by the AuditService
          // This interceptor attaches audit metadata to the request
          request.auditData = {
            userId: user?.sub,
            action: method,
            module: url.split('/')[2] || 'unknown',
            entityId: responseData?.data?.id || null,
            detail: { method, url },
            ipAddress: ip,
          };
        }),
      );
    }

    return next.handle();
  }
}
