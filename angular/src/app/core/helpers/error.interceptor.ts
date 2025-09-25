import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {

            if (err.status === 401) {
                this.authenticationService.logout();
                location.reload();
            }

            if (err.error instanceof Blob && err.error.type === "application/json") {
                return new Observable<HttpEvent<any>>((observer) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const errorData = JSON.parse(reader.result as string);
                            const errorMessage = errorData.message || err.statusText;
                            observer.error(errorMessage);
                        } catch (jsonError) {
                            observer.error("Une erreur c'est produite");
                        }
                        observer.complete();
                    };
                    reader.readAsText(err.error);
                });
            } else if(!(err.error instanceof Blob)){
                return throwError(err.error.message);
            } 
            else{
                return throwError("Une erreur c'est produite");
            }
        }));
    }
}
