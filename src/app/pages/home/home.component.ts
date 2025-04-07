import { Component } from '@angular/core';
import {FormComponent} from '../../components/form/form.component';
import {CardComponent} from '../../components/card/card.component';
import {InputSearchComponent} from '../../components/input-search/input-search.component';
import {TitleComponent} from '../../components/title/title.component';
import {ItemComponent} from '../../components/item/item.component';
import {InfoComponent} from '../info/info.component';
import {ComoComprarComponent} from '../como-comprar/como-comprar.component';
import {TransparenciaComponent} from '../../components/transparencia/transparencia.component';
import {PacotesComponent} from '../pacotes/pacotes.component';
import {PrecoService} from '../../services/preco.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormComponent,
    CardComponent,
    InputSearchComponent,
    TitleComponent,
    ItemComponent,
    InfoComponent,
    ComoComprarComponent,
    TransparenciaComponent,
    PacotesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private precoService: PrecoService) {
    this.precoService.resetPreco()
  }

}
