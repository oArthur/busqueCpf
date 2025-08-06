import {Component, Inject, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {FormContatoComponent} from '../../components/form-contato/form-contato.component';
import {PrecoService} from '../../services/preco.service';
import {Subscription} from 'rxjs';
import {CurrencyPipe, DecimalPipe, NgIf} from '@angular/common';
import {CpfFormatPipe} from '../../pipes/cpf-format.pipe';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-form-compra',
  standalone: true,
    imports: [
        FormContatoComponent,
        CurrencyPipe,
        DecimalPipe,
        NgIf,
        CpfFormatPipe,
        MatIcon,
        RouterLink
    ],
  templateUrl: './form-compra.component.html',
  styleUrl: './form-compra.component.scss'
})
export class FormCompraComponent implements OnInit, OnDestroy{

  @Input() tipoBusca: "completa" | "parcial" = "parcial"
  @Input() cpf!: string;

  preco!: number;
  discountValue: number | null = null;
  private precoSubscription!: Subscription;
  private discountSubscription!: Subscription;
  data: { packId: number; preco: number; value: number }

  constructor(private precoService: PrecoService,
              @Optional() public dialogRef: MatDialogRef<FormCompraComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA)
                dataProvided?: Partial<{ packId: number; preco: number; value: number }>) {
    this.data = {
      packId: dataProvided?.packId ?? 0,
      preco:  dataProvided?.preco  ?? 0,
      value:  dataProvided?.value  ?? 0
    };
  }

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

  onOrderGenerated(response: any) {
    console.log('Pedido gerado no filho:', response);
    // Fecha o modal passando a resposta se necessário
    this.dialogRef.close(response);
  }

  ngOnDestroy(): void {
    this.precoSubscription.unsubscribe();
    this.discountSubscription.unsubscribe();
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
