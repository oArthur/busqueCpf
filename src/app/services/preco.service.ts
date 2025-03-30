import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecoService {
  // Valor original do preço
  private readonly initialPreco: number = 14.90;

  // BehaviorSubject para armazenar o preço atual
  private precoSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.initialPreco);
  public preco$: Observable<number> = this.precoSubject.asObservable();

  // Novo BehaviorSubject para emitir o valor do desconto aplicado (em reais)
  private discountSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public discount$: Observable<number | null> = this.discountSubject.asObservable();

  constructor() { }

  // Retorna o preço atual de forma síncrona
  public getPreco(): number {
    return this.precoSubject.getValue();
  }
  public alterarPreco(valor: number, operacao: "soma" | "sub"): void {
    const precoAtual = this.getPreco();
    const novoPreco = operacao === "soma" ? precoAtual + valor : precoAtual - valor;
    this.precoSubject.next(novoPreco);
  }

  /**
   * Aplica um desconto percentual sobre o valor inicial, atualiza o preço e emite o valor do desconto.
   * @param discountPercentage Percentual de desconto (ex: 10 para 10%)
   */
  public aplicarDesconto(discountPercentage: number): void {
    const precoAtual = this.getPreco();
    const discountValue = precoAtual * (discountPercentage / 100);
    // Calcula o novo preço
    const novoPreco = precoAtual - discountValue;
    // Atualiza o preço
    this.precoSubject.next(novoPreco);
    // Emite o valor do desconto aplicado
    this.discountSubject.next(discountValue);
  }

  /**
   * Reseta o preço e remove o desconto.
   */
  public resetPreco(): void {
    this.precoSubject.next(this.initialPreco);
    this.discountSubject.next(null);
  }
}
