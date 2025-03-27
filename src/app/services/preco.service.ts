import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecoService {
  private readonly defaultPreco: number = 14.90;

  private initialPreco: number = this.defaultPreco;

  private precoSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.initialPreco);
  public preco$: Observable<number> = this.precoSubject.asObservable();

  private discountSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public discount$: Observable<number | null> = this.discountSubject.asObservable();

  constructor() { }

  public getPreco(): number {
    return this.precoSubject.getValue();
  }

  public setPreco(novoPreco: number): void {
    this.initialPreco = novoPreco;

    this.precoSubject.next(novoPreco);

    this.discountSubject.next(null);
  }
  public aplicarDesconto(discountPercentage: number): void {
    const discountValue = this.initialPreco * (discountPercentage / 100);
    const novoPreco = this.initialPreco - discountValue;
    this.precoSubject.next(novoPreco);
    this.discountSubject.next(discountValue);
  }

  public resetPreco(): void {
    this.initialPreco = this.defaultPreco;
    this.precoSubject.next(this.defaultPreco);
    this.discountSubject.next(null);
  }
}
