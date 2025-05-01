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
    { name: 'Nome Completo', cor: "#e7e7e7" },
    { name: 'Data de Nascimento', cor: "#e7e7e7" },
    { name: 'Gênero', cor: "#e7e7e7" },
    { name: 'Nome da Mãe', cor: "#e7e7e7" },
    { name: 'Provável Óbito', cor: "#e7e7e7" },
    { name: 'Situação do CPF', cor: "#e7e7e7" },
    { name: 'Ocupação Profissional', cor: "#e7e7e7" },
    { name: 'Faixa Salarial', cor: "#e7e7e7" },
    { name: 'Renda', cor: "#e7e7e7" },
    { name: 'E-mails', cor: "#e7e7e7" },
    { name: 'Celulares*', cor: "#e7e7e7" },
    { name: 'Telefones*', cor: "#e7e7e7" },
    { name: 'Endereços*', cor: "#e7e7e7" },
    { name: 'Parentes e Vínculos*', cor: "#e7e7e7" },
    { name: 'Participação em CNPJS*', cor: "#e7e7e7" },
  ]

}
