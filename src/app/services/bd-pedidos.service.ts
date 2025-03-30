import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BdPedidosService {
  private apiUrl = 'https://jarvis-app.referencia.company/webhook/get-pedido-db';

  constructor(private http: HttpClient) {}

  verificarStatusPedido(id: string, cpf: string): Observable<boolean> {
    return this.http.get<{ success?: boolean }>(`${this.apiUrl}?id=${id}&cpf=${cpf}`)
      .pipe(
        map(response => response.success === true), // Retorna true apenas se `success` for true
        catchError(() => {
          return new Observable<boolean>(observer => {
            observer.next(false); // Em caso de erro, assume que o pagamento NÃO está aprovado
            observer.complete();
          });
        })
      );
  }


}
