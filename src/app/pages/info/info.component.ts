import { Component } from '@angular/core';
import {TitleComponent} from "../../components/title/title.component";
import {ItemComponent} from '../../components/item/item.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    TitleComponent,
    ItemComponent,
    NgForOf
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

  items = [
    { name: 'Nome Completo', cor: "#E5E6FB" },
    { name: 'Data de Nascimento', cor: "#E5E6FB" },
    { name: 'Gênero', cor: "#E5E6FB" },
    { name: 'Nome da Mãe', cor: "#E5E6FB" },
    { name: 'Provável Óbito', cor: "#E5E6FB" },
    { name: 'Situação do CPF', cor: "#E5E6FB" },
    { name: 'Ocupação Profissional', cor: "#E5E6FB" },
    { name: 'Faixa Salarial', cor: "#E5E6FB" },
    { name: 'Renda', cor: "#E5E6FB" },
    { name: 'E-mails', cor: "#E5E6FB" },
    { name: 'Celulares*', cor: "#E5E6FB" },
    { name: 'Telefones*', cor: "#E5E6FB" },
    { name: 'Endereços*', cor: "#E5E6FB" },
    { name: 'Parentes e Vínculos*', cor: "#E5E6FB" },
    { name: 'Participação em CNPJS*', cor: "#E5E6FB" },
  ]

}
