import { Component } from '@angular/core';
import {CardPackComponent} from '../../components/card-pack/card-pack.component';
import {ICardPack} from '../../interfaces';
import {TitleComponent} from '../../components/title/title.component';
import {NgForOf} from '@angular/common';
import {data} from 'autoprefixer';

@Component({
  selector: 'app-pacotes',
  standalone: true,
  imports: [
    CardPackComponent,
    TitleComponent,
    NgForOf
  ],
  templateUrl: './pacotes.component.html',
  styleUrl: './pacotes.component.scss'
})
export class PacotesComponent {

  content: any = [{
    id: 51,
    title: 'Pacote 25 Buscas',
    isMostPopular: false,
    price: 299,
    value: 25,
    subtitle: "",
    buttonLabel: 'Comprar agora',
    description: [
      '25 buscas de CPF completas inclusas',
      'Menos de R$ 10 por consulta',
      'Validade de 90 dias',
      'Suporte prioritário via email',
      'Relatórios detalhados com status do CPF'
    ]
  },
    {
      id: 52,
      title: 'Pacote 50 Buscas',
      isMostPopular: true,
      price: 399,
      value: 50,
      subtitle: "",
      buttonLabel: 'Comprar agora',
      description: [
        '50 buscas de CPF inclusas',
        'Menos de R$ 8 por consulta',
        'Validade de 90 dias',
        'Suporte prioritário via email',
        'Relatórios detalhados com status do CPF'
      ]
    },
    {
      id: 53,
      title: 'Pacote 100 Buscas',
      isMostPopular: false,
      price: 499,
      value: 100,
      subtitle: "",
      buttonLabel: 'Comprar agora',
      description: [
        '100 buscas de CPF inclusas',
        'Menos de R$ 5 por consulta',
        'Validade de 90 dias',
        'Suporte prioritário via email',
        'Relatórios detalhados com status do CPF'
      ]
    }]

  protected readonly data = data;
}
