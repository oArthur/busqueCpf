import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormResultadoComponent} from '../../components/form-resultado/form-resultado.component';
import {ComoComprarComponent} from '../como-comprar/como-comprar.component';
import {TransparenciaComponent} from '../../components/transparencia/transparencia.component';
import {FormContatoComponent} from '../../components/form-contato/form-contato.component';
import {FormCompraComponent} from '../form-compra/form-compra.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-resultado-parcial',
  standalone: true,
  templateUrl: './resultado-parcial.component.html',
  imports: [
    FormResultadoComponent,
    ComoComprarComponent,
    TransparenciaComponent,
    FormContatoComponent,
    FormCompraComponent,
    NgIf
  ],
  styleUrl: './resultado-parcial.component.scss'
})
export class ResultadoParcialComponent {

  cpf: string | null = null;
  dadosParciais: { label: string; valor: string }[] = [];
  carregando: boolean = false;

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { label: string, chave: string }[] = [
    { label: "Nome Completo", chave: "nome" },
    { label: "Gênero", chave: "sexo" },
    { label: "Data de Nascimento", chave: "data_nascimento" },
    { label: "Nome da Mãe", chave: "nome_mae" },
    { label: "Situação do CPF", chave: "situacao_cpf" },
    { label: "Provável Óbito", chave: "" },
    { label: "Ocupação Profissional", chave: "" },
    { label: "Renda", chave: "" },
    { label: "Vínculos", chave: "" },
    { label: "Participação Societária", chave: "" },
    { label: "Histórico Profissional", chave: "" },
    { label: "WhatsApp", chave: "" },
    { label: "Telefone", chave: "" },
    { label: "E-Mail", chave: "" },
  ];

  constructor(private router: Router) {
    this.carregando = true;
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      const dadosRecebidos = navigation.extras.state['dados'];
      this.cpf = navigation.extras.state['cpf'];

      // Se a API retorna um array, pegamos o primeiro item
      const dadosObj = Array.isArray(dadosRecebidos) && dadosRecebidos.length > 0 ? dadosRecebidos[0] : {};

      // Mapeia os valores recebidos da API para as labels fixas
      this.dadosParciais = this.labelsFixas.map(item => ({
        label: item.label,
        valor: this.formatarValor(item.chave, dadosObj[item.chave]) // Formata os valores corretamente
      }));
      this.carregando = false;
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Formata os valores para garantir legibilidade
   */
  formatarValor(chave: string, valor: any): string {
    if (!valor) return "Verificado ✅"; // Caso o valor seja nulo ou indefinido

    if (chave === "data_nascimento") {
      return this.formatarData(valor);
    }

    return valor.toString(); // Retorna como string
  }
  formatarData(data: string): string {
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return "N/A";
  }
}
