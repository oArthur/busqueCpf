import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {CupomResponse} from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class PagarMeService {
  private baseUrl = 'https://jarvis-app.referencia.company/webhook/generatePayment'

  constructor(private http: HttpClient) {}

  createOrder(user: { document: string; nome: string; email: string }, cpf: string | null, cupom?: CupomResponse): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log(`Cupom: ${cupom}` )

    const body = {

      customer: {
        name: user.nome,
        email: user.email,
        document: user.document,
        document_type: "CPF",
        type: "individual"
      },
      items: [
        {
          code: "50",
          quantity: 1,
          description: "Pesquisa Completa de CPF",
        }
      ],
      payments: [
        {
          payment_method: "pix",
          pix: {
            expires_in: "300",
            additional_information: [
              {
                name: "Busca CPF",
                value: cpf
              }
            ]
          }
        }
      ],
      closed: true,
      ...(cupom && { cupom: cupom.cupom })

    }
    return this.http.post(this.baseUrl, body, { headers });
  }

  getOrderApproved(id: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    return this.http.get<any>(`https://jarvis-app.referencia.company/webhook/verifyPayment?id=${id}`, { headers }).pipe(
      map(response => response.status === 'paid'),
      catchError(error => {
        console.error('Erro ao buscar pedido:', error);
        return of(false);
      })
    );
  }


}




