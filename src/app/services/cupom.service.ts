import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {CupomResponse, IGenerateCupom} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CupomService {

  private url = "https://jarvis-app.referencia.company/webhook"

  constructor(private http: HttpClient) { }

  searchCupom(code:string): Observable<CupomResponse>{
    const url: string  = `${this.url}/validar-cupom?code=${code}`

    return this.http.get<CupomResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  generateCupom(id: string, cpf: string){
    const url: string = `${this.url}/generate-cupom?id=${id}&cpf=${cpf}`

    return this.http.get<IGenerateCupom>(url).pipe(
      catchError(this.handleError)
    )

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
