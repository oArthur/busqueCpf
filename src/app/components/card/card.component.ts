import {Component, Input} from '@angular/core';
import {InputSearchComponent} from "../input-search/input-search.component";
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-card',
  standalone: true,
    imports: [
        InputSearchComponent,
        ModalComponent
    ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() name: string = ''
  @Input() description: string = ''
  @Input() photo: string = ''


  isModalOpen: boolean = false;

  abrirModal() {
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

}
