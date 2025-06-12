import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  constructor(private http: HttpClient) {
  }

  getTokenClientModule(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>('https://api-recaptcha.onrender.com/verificar-captcha' + token + '/', httpOptions)
      .pipe(
        map((response) => response),
        catchError((err) => {
          console.log('error caught in service')
          console.error(err);
          throw err;
        })
      );
  }

  async verificarCaptchaBackend(token: any): Promise<boolean> {
    try {
      const response = await fetch('https://api-recaptcha.onrender.com/verificar-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });

      const result = await response.json();
      return result.success;
    } catch (err) {
      console.error('Error al verificar el captcha:', err);
      return false;
    }
  }

}