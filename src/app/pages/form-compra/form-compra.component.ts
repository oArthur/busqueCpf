import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormContatoComponent} from '../../components/form-contato/form-contato.component';
import {PrecoService} from '../../services/preco.service';
import {Subscription} from 'rxjs';
import {CurrencyPipe, DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-form-compra',
  standalone: true,
  imports: [
    FormContatoComponent,
    CurrencyPipe,
    DecimalPipe,
    NgIf
  ],
  templateUrl: './form-compra.component.html',
  styleUrl: './form-compra.component.scss'
})
export class FormCompraComponent implements OnInit, OnDestroy{

  preco!: number;
  discountValue: number | null = null;
  private precoSubscription!: Subscription;
  private discountSubscription!: Subscription;

  constructor(private precoService: PrecoService) {}

  ngOnInit(): void {
    // Inscreve no observable do preço
    this.precoSubscription = this.precoService.preco$.subscribe(value => {
      this.preco = value;
    });

    // Inscreve no observable do desconto para exibir o aviso quando houver desconto
    this.discountSubscription = this.precoService.discount$.subscribe(value => {
      this.discountValue = value;
    });
  }

  ngOnDestroy(): void {
    this.precoSubscription.unsubscribe();
    this.discountSubscription.unsubscribe();
  }

  @Input() cpf!: string;

}
