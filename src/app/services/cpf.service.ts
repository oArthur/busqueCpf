import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpfService {

  private apiUrl = 'https://jarvis-app.referencia.company/webhook/buscarCpf';
  private apiKey = '^9SebyRg1kM*DjLDVM^%'; //TODO colocar em uma variável de ambiente.

  constructor(private http: HttpClient) { }

  buscarCpf(cpf: string, dadosCompletos: boolean = false): Observable<any>{
    const url = `${this.apiUrl}?numero=${cpf}&dados_completos=${dadosCompletos}`;
    const headers = new HttpHeaders({
      'api-key': this.apiKey
    });
    return this.http.get<any>(url, {headers});
  }
}
