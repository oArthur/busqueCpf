import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {CupomResponse} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CupomService {

  private url = "https://jarvis-app.referencia.company/webhook/validar-cupom"

  constructor(private http: HttpClient) { }

  searchCupom(code:string): Observable<CupomResponse>{
    const url: string  = `${this.url}?code=${code}`

    return this.http.get<CupomResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
