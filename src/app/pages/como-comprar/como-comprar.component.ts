import { Component } from '@angular/core';
import {TitleComponent} from '../../components/title/title.component';
import {CardComponent} from '../../components/card/card.component';

@Component({
  selector: 'app-como-comprar',
  standalone: true,
  imports: [
    TitleComponent,
    CardComponent
  ],
  templateUrl: './como-comprar.component.html',
  styleUrl: './como-comprar.component.scss'
})
export class ComoComprarComponent {

}
