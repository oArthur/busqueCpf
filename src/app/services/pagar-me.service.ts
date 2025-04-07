import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CupomResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PagarMeService {
  private baseUrl = 'https://jarvis-app.referencia.company/webhook/generatePayment';

  constructor(private http: HttpClient) {}

  // TODO parei aqui, quando gerar o pagamento e o mesmo pagar preciso redirecionar o usuario para uma pagina onde mostre o cupom que foi gerado para ele.

  createOrder(
    user: { document: string; nome: string; email: string },
    cpf: string | null,
    cupom?: CupomResponse,
    adicionais?: string[],
    idPedido?: string,
    pack?: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const packMap: Record<number, { code: string; description: string }> = {
      51: { code: '51', description: 'Pack 25 pesquisas' },
      52: { code: '52', description: 'Pack 50 pesquisas' },
      53: { code: '53', description: 'Pack 100 pesquisas' },
    };

    let itemCode = '50';
    let itemDescription = 'Pesquisa Completa de CPF';

    if (pack && packMap[pack]) {
      itemCode = packMap[pack].code;
      itemDescription = packMap[pack].description;
    }

    const body: any = {
      customer: {
        name: user.nome,
        email: user.email,
        document: user.document,
        document_type: 'CPF',
        type: 'individual',
      },
      items: [
        {
          code: itemCode,
          quantity: 1,
          description: itemDescription,
        },
      ],
      payments: [
        {
          payment_method: 'pix',
          pix: {
            expires_in: '300',
            additional_information: [
              {
                name: itemDescription,
                value: cpf ? cpf : itemDescription,
              },
            ],
          },
        },
      ],
      closed: true,
    };

    if (idPedido) body.idPedido = idPedido;
    if (cupom) body.cupom = cupom.cupom;
    if (adicionais) body.adicionais = adicionais;

    return this.http.post(this.baseUrl, body, { headers });
  }

  getOrderApproved(id: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http
      .get<any>(`https://jarvis-app.referencia.company/webhook/verifyPayment?id=${id}`, {
        headers,
      })
      .pipe(
        map((response) => response.status === 'paid'),
        catchError((error) => {
          console.error('Erro ao buscar pedido:', error);
          return of(false);
        })
      );
  }
}
