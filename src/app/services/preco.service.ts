import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecoService {
  // Valor original do preço
  private readonly initialPreco: number = 13.90;

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

  /**
   * Aplica um desconto percentual sobre o valor inicial, atualiza o preço e emite o valor do desconto.
   * @param discountPercentage Percentual de desconto (ex: 10 para 10%)
   */
  public aplicarDesconto(discountPercentage: number): void {
    // Calcula o valor do desconto (ex: 13.90 * 0.10 = 1.39 para 10%)
    const discountValue = this.initialPreco * (discountPercentage / 100);
    // Calcula o novo preço
    const novoPreco = this.initialPreco - discountValue;
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
