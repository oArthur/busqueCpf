import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import {ModalComponent} from '../modal/modal.component';
import {InputSearchComponent} from '../input-search/input-search.component';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgStyle, ModalComponent, InputSearchComponent, NgClass
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {

  @Input() nome: string = ''
  @Input() cor: string = '#3498db';


  isModalOpen: boolean = false;

  abrirModal() {
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

}
