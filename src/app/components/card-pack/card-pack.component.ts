import {Component, Input} from '@angular/core';
import {ICardPack} from '../../interfaces';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {InputSearchComponent} from '../input-search/input-search.component';
import {ModalComponent} from '../modal/modal.component';
import {FormCompraComponent} from '../../pages/form-compra/form-compra.component';
import {PrecoService} from '../../services/preco.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-card-pack',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    NgIf,
    InputSearchComponent,
    ModalComponent,
    FormCompraComponent
  ],
  templateUrl: './card-pack.component.html',
  styleUrl: './card-pack.component.scss'
})
export class CardPackComponent {


  constructor(private precoService: PrecoService, private dialog: MatDialog) {
  }

  @Input() data!: ICardPack;

  comprarPack(id: number, preco: number, value: number) {
    this.precoService.setPreco(preco);
    this.dialog.open(FormCompraComponent, {
      width: '400px',
      maxHeight: '90vh',
      disableClose: false,
      data: { packId: id, preco: preco, value: value }
    });

  }

}
