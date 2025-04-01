import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BdPedidosService {
  private apiUrl = 'https://jarvis-app.referencia.company/webhook/get-pedido-db';

  constructor(private http: HttpClient) {}

  verificarStatusPedido(id: string, cpf: string): Observable<string[]> {
    return this.http.get<{ success?: boolean, itens?: string[] }>(`${this.apiUrl}?id=${id}&cpf=${cpf}`)
      .pipe(
        map(response => {
          // Se a resposta indicar sucesso e possuir itens, retorna-os; caso contrário, retorna um array vazio.
          if (response.success === true && Array.isArray(response.itens)) {
            return response.itens;
          }
          return [];
        }),
        catchError(() => {
          // Em caso de erro, assume que não há itens (ou seja, pagamento não aprovado)
          return of([]);
        })
      );
  }



}
