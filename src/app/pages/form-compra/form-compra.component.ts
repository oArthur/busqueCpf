import {Component, Inject, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import { FormContatoComponent } from '../../components/form-contato/form-contato.component';
import { PrecoService } from '../../services/preco.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-compra',
  standalone: true,
  imports: [
    FormContatoComponent,
    CurrencyPipe,
    DecimalPipe,
    NgIf,
    MatIconModule  // Importa o módulo do ícone para usar <mat-icon>
  ],
  templateUrl: './form-compra.component.html',
  styleUrl: './form-compra.component.scss'
})
export class FormCompraComponent implements OnInit, OnDestroy {

  preco!: number;
  discountValue: number | null = null;
  private precoSubscription!: Subscription;
  private discountSubscription!: Subscription;

  @Input() cpf!: string;

  constructor(
    private precoService: PrecoService,
    @Optional() public dialogRef: MatDialogRef<FormCompraComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { packId: number, preco: number, value: number }
  ) {}

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

  // Função para fechar o modal
  onClose(): void {
    this.dialogRef.close();
  }
}
