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
    { name: 'Nome Completo', cor: "#3498db" },
    { name: 'Data de Nascimento', cor: "#3498db" },
    { name: 'Gênero', cor: "#3498db" },
    { name: 'Nome da Mãe', cor: "#28A745" },
    { name: 'Provável Óbito', cor: "#28A745" },
    { name: 'Situação do CPF', cor: "#28A745" },
    { name: 'Ocupação Profissional', cor: "#28A745" },
    { name: 'Faixa Salarial', cor: "#28A745" },
    { name: 'Renda', cor: "#28A745" },
    { name: 'E-mails', cor: "#28A745" },
    { name: 'Celulares*', cor: "#DC3545" },
    { name: 'Telefones*', cor: "#DC3545" },
    { name: 'Endereços*', cor: "#DC3545" },
    { name: 'Parentes e Vínculos*', cor: "#DC3545" },
    { name: 'Participação em CNPJS*', cor: "#DC3545" },
  ]

}
