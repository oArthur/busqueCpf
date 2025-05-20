import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpfService {

  private apiUrl = 'https://jarvis-app.referencia.company/webhook/buscarCpf';
  private apiKey = '^9SebyRg1kM*DjLDVM^%'; //TODO colocar em uma variável de ambiente.

  constructor(private http: HttpClient) { }

  buscarCpf(cpf: string, dadosCompletos: boolean = false, itensAdicionais?: string[]): Observable<any> {
    const url = `${this.apiUrl}?numero=${cpf}&dados_completos=${dadosCompletos}`;
    const headers = new HttpHeaders({
      'api-key': this.apiKey
    });

    return this.http.get<any>(url, { headers })
      .pipe(
        map((response: any[]) => {
          // Se não for para retornar os dados completos, processa a resposta
          this.registrarBusca(cpf).subscribe();
          if (!dadosCompletos) {
            return this.processarDados(response);
          }
          // Caso contrário, retorna a resposta original
          return this.processarDados(response, true, itensAdicionais);
        })
      );
  }

  registrarBusca(cpf: string): Observable<any> {
    const url = `https://jarvis-app.referencia.company/webhook/novopedidocpf`;

    const body = {
      cpf: cpf
    };
    const headers = new HttpHeaders({
      'X-Origin': "busquecpf.com.br"
    });

    return this.http.post<any>(url, body, { headers });
  }

  private processarDados(dados: any[], completa: boolean = false, adicionaisComprados: string[] = []): any[] {
    return dados.map(item => {
      // 1. Definindo os campos principais e os campos de contagem (itens adicionais)
      const mainFields = ['nome', 'data_nascimento', 'cpf'];
      const countFields: { [key: string]: { singular: string, plural: string } } = {
        telefones: { singular: 'telefone', plural: 'telefones' },
        historico_profissional: { singular: 'registro de histórico profissional', plural: 'históricos profissionais' },
        participacao_societaria: { singular: 'registro de participação societária', plural: 'participações societárias' },
        vinculos: { singular: 'registro de vínculo', plural: 'vínculos' },
        enderecos: { singular: 'registro de endereço', plural: 'endereços' }
      };

      let resultado: any = {};

      // 2. Copiar os campos principais sem alteração
      mainFields.forEach(field => {
        resultado[field] = item[field];
      });

      // 3. Processar os campos de contagem (itens adicionais)
      // Se o campo estiver na lista 'adicionaisComprados', retorna o valor original da API.
      // Caso contrário, formata a mensagem com a contagem.
      Object.keys(countFields).forEach(field => {
        if (adicionaisComprados.includes(field)) {
          resultado[field] = item[field] != null ? item[field] : "Sem registro";
        } else {
          const registros = Array.isArray(item[field]) ? item[field].length : 0;
          if (registros === 1) {
            resultado[field] = `Foi encontrado 1 ${countFields[field].singular}.`;
          } else if (registros > 1) {
            resultado[field] = `Foram encontrados ${registros} ${countFields[field].plural}.`;
          } else {
            resultado[field] = "Sem registro";
          }
        }
      });

      // 4. Processar os demais campos:
      // Se o campo estiver vazio, retorna "Sem registro".
      // Caso tenha valor, para busca parcial retorna "null
      // e para busca completa retorna o valor original.
      Object.keys(item).forEach(field => {
        if (!mainFields.includes(field) && !(field in countFields)) {
          const valor = item[field];
          if (
            valor === null ||
            valor === '' ||
            (typeof valor === 'string' && valor.trim() === "{}") ||
            (Array.isArray(valor) && valor.length === 0)
          ) {
            resultado[field] = "Sem registro";
          } else {
            resultado[field] = completa ? valor : null;
          }
        }
      });

      return resultado;
    });
  }



}
