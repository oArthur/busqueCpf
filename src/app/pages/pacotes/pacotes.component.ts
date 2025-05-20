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
    title: 'Plano Start 10',
    isMostPopular: false,
    price: 149,
    value: 10,
    subtitle: "10 consultas de CPF",
    buttonLabel: 'Comprar agora',
    description: [
      'Apenas R$ 14,90 por consulta',
      'Validade de 90 dias',
      'Relatórios detalhados',
      'Suporte por e-mail'
    ]
  },
    {
      id: 52,
      title: 'Plano Flex 15',
      isMostPopular: false,
      price: 199,
      value: 15,
      subtitle: "15 consultas de CPF",
      buttonLabel: 'Comprar agora',
      description: [
        'Apenas R$ 14,27 por consulta',
        'Validade de 90 dias',
        'Relatórios detalhados',
        'Suporte por e-mail'
      ]
    },
    {
      id: 53,
      title: 'Plano Pro 30',
      isMostPopular: true,
      price: 259,
      value: 100,
      subtitle: "30 consultas de CPF",
      buttonLabel: 'Comprar agora',
      description: [
        'Apenas R$ 8,63 por consulta',
        'Validade de 90 dias',
        'Relatórios detalhados',
        'Suporte prioritário'
      ]
    }]

  protected readonly data = data;
}
