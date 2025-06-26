import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { SharedService } from './services/shared.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.sharedService.showSpinner(); // Show spinner before request
    //Make sure to send credentials (cookie) with every request
    const cloned = request.clone({ withCredentials: true });
    return next.handle(cloned).pipe(
      finalize(() => {
        this.sharedService.hideSpinner(); // Hide spinner after response or error
      })
    );
  }
}
