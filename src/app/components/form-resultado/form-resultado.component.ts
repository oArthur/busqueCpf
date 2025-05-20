import { Component, Input, OnInit } from '@angular/core';
import {
  CurrencyPipe,
  DatePipe, JsonPipe,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault, TitleCasePipe
} from '@angular/common';
import { CpfFormatPipe } from '../../pipes/cpf-format.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PrecoService } from '../../services/preco.service';
import { Subscription } from 'rxjs';
import {AdicionaisService} from '../../services/adicionais.service';
import {NgxMaskPipe} from 'ngx-mask';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-form-resultado',
  standalone: true,
  imports: [NgForOf, NgIf, CurrencyPipe, CpfFormatPipe, DatePipe, DateFormatPipe, NgClass, NgxMaskPipe, NgSwitch, NgSwitchCase, NgSwitchDefault, KeyValuePipe, TitleCasePipe, MatIcon, JsonPipe],
  templateUrl: './form-resultado.component.html',
  styleUrls: ['./form-resultado.component.scss']
})
export class FormResultadoComponent implements OnInit {
  @Input() titulo: string = "RELATÓRIO PARCIAL";
  @Input() dados: any[] = [];
  @Input() mostrarBotao: boolean = true;
  @Input() textoBotao: string = "🔒 Liberar Relatório Completo";

  // Novos inputs:
  // Define se o resultado é completo (true) ou parcial (false)
  @Input() resultadoCompleto: boolean = false;
  // Lista de nomes dos itens adicionais já adquiridos
  @Input() comprouAdicionais: string[] = [];

  telefones: any[] = [];
  participacaoSocietaria: any[] = [];
  historicoProfissional: any[] = [];
  emails: string[] = [];
  enderecos: any[] = [];
  signos: any[] = [];
  vinculos: any[] = [];
  preco!: number;
  private precoSubscription!: Subscription;

  constructor(private precoService: PrecoService,private adicionaisService: AdicionaisService) {}

  ngOnInit() {
    // console.log(this.dados);
    this.precoSubscription = this.precoService.preco$.subscribe(value => {
      this.preco = value;
    });


    // Normaliza os dados e adiciona a propriedade "selected" para itens adicionais
    this.dados = this.dados.map(item => ({
      ...item,
      // Se o valor for um objeto vazio, converte para null
      valor: (typeof item.valor === 'object' && Object.keys(item.valor).length === 0) ? null : item.valor,
      // Define selected para itens adicionais; para os demais, mantém o valor original
      selected: item.adicional ? false : item.selected
    }));

    // Telefones
    const telefoneItem = this.dados.find(item => item.name === 'telefones');
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
    const emailItem = this.dados.find(item => item.name === 'emails');
    if (emailItem && Array.isArray(emailItem.valor)) {
      this.emails = emailItem.valor;
    }
    console.log(this.emails)

    // Endereços
    const enderecoItem = this.dados.find(item => item.name === 'enderecos');
    if (enderecoItem && Array.isArray(enderecoItem.valor)) {
      this.enderecos = enderecoItem.valor;
    }

    const vinculoItem = this.dados.find(item => item.name === 'vinculos');
    if (vinculoItem && Array.isArray(vinculoItem.valor)) {
      this.vinculos = vinculoItem.valor;
    }
    const signosItem = this.dados.find(item => item.name === 'signos');
    if (signosItem && signosItem.valor && typeof signosItem.valor === 'object') {
      this.signos = Object.entries(signosItem.valor).map(([key, value]) => ({
        nome: this.getRotuloSigno(key),
        valor: value
      }));
    }
  }

  readonly rotulosSignos: { [key: string]: string } = {
    zodiaco: 'Zodíaco',
    zodiaco_elemento: 'Elemento do Zodíaco',
    zodiaco_regente: 'Regente do Zodíaco',
    chines: 'Chinês',
    chines_elemento: 'Elemento Chinês',
    maia: 'Maia',
    egipcio: 'Egípcio',
    celta: 'Celta',
    vedico: 'Védico',
    xamanico: 'Xamânico'
  };

  beneficios = ['Dados completos sem censura', 'Endereços atualizados', 'Telefones e e-mails válidos',
    'Histórico de endereços', 'Vínculos familiares', 'Dados profissionais']

  getRotuloSigno(chave: string): string {
    return this.rotulosSignos[chave] || this.capitalize(chave.replace(/_/g, ' '));
  }

  private capitalize(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  getRecordCount(item: any): number {
    const valor = item?.valor;
    if (!valor || valor === 'Sem registro' || valor === 'Não informado') {
      return 0;
    }
    if (Array.isArray(valor)) {
      return valor.length;
    }
    if (typeof valor === 'object') {
      return Object.keys(valor).length;
    }
    // Se for string ou número, consideramos como 1 registro
    return 1;
  }

  /**
   * Exibe o botão "Adicionar/Remover" somente se for um item adicional
   * com dados, no resultado completo, e se ainda não estiver comprado.
   */
  podeExibirBotao(item: any): boolean {
    return (
      this.resultadoCompleto &&
      item.adicional &&
      this.getRecordCount(item) > 0 &&
      !this.comprouAdicionais.includes(item.name)
    );
  }

  toggleSelect(item: any): void {
    // Permite alternar a seleção somente se o item for adicional e tiver registro válido
    if (item.adicional && item.valor && item.valor !== 'Sem registro' && item.valor !== 'Não informado') {
      item.selected = !item.selected;

      // Atualiza o preço conforme a seleção
      if (item.selected) {
        this.precoService.alterarPreco(item.preco, "soma");
        this.adicionaisService.addItem(item.name);
      } else {
        this.precoService.alterarPreco(item.preco, "sub");
        this.adicionaisService.removeItem(item.name);
      }
    }
  }

  scrollParaCompra() {
    const elemento = document.getElementById('compra');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
