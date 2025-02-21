// form-resultado.component.ts
import { Component, Input, OnInit } from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-form-resultado',
  standalone: true,
  imports: [NgForOf, NgIf, CurrencyPipe],
  templateUrl: './form-resultado.component.html',
  styleUrl: './form-resultado.component.scss'
})
export class FormResultadoComponent implements OnInit {
  @Input() titulo: string = "RELATÓRIO PARCIAL";
  @Input() dados: any[] = [];
  @Input() mostrarBotao: boolean = true;
  @Input() textoBotao: string = "🔒 Liberar Relatório Completo";

  telefones: any[] = [];
  participacaoSocietaria: any[] = [];
  historicoProfissional: any[] = [];
  emails: string[] = [];
  enderecos: any[] = [];
  vinculos: any[] = [];

  ngOnInit() {
    console.log(this.dados);

    // Telefones
    const telefoneItem = this.dados.find(item => item.name === 'telefone');
    if (telefoneItem && Array.isArray(telefoneItem.valor)) {
      this.telefones = telefoneItem.valor;
    }

    // Participação Societária
    const participacaoItem = this.dados.find(item => item.name === 'participacao_societaria');
    if (participacaoItem && Array.isArray(participacaoItem.valor)) {
      this.participacaoSocietaria = participacaoItem.valor;
    }

    // Histórico Profissional
    const historicoItem = this.dados.find(item => item.name === 'historico_profissional');
    if (historicoItem && Array.isArray(historicoItem.valor)) {
      this.historicoProfissional = historicoItem.valor;
    }

    // E-mails
    const emailItem = this.dados.find(item => item.name === 'email');
    if (emailItem && Array.isArray(emailItem.valor)) {
      this.emails = emailItem.valor;
    }

    // Endereços
    const enderecoItem = this.dados.find(item => item.name === 'enderecos');
    if (enderecoItem && Array.isArray(enderecoItem.valor)) {
      this.enderecos = enderecoItem.valor;
    }
  }

  scrollParaCompra() {
    const elemento = document.getElementById('compra');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
