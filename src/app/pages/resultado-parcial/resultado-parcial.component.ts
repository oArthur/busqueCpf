import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormResultadoComponent } from '../../components/form-resultado/form-resultado.component';
import { ComoComprarComponent } from '../como-comprar/como-comprar.component';
import { TransparenciaComponent } from '../../components/transparencia/transparencia.component';
import { FormContatoComponent } from '../../components/form-contato/form-contato.component';
import { FormCompraComponent } from '../form-compra/form-compra.component';
import { NgIf } from '@angular/common';

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
  dadosParciais: { name: string, label: string, valor: string, show: boolean }[] = [];
  carregando: boolean = false;

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { name: string, label: string, chave: string, show: boolean }[] = [
    { name: "nome", label: "Nome Completo", chave: "nome", show: true },
    { name: "genero", label: "Gênero", chave: "", show: true },
    { name: "dta_nascimento", label: "Data de Nascimento", chave: "data_nascimento", show: true },
    { name: "nome_mae", label: "Nome da Mãe", chave: "", show: true },
    { name: "cpf", label: "CPF", chave: "cpf", show: true },
    { name: "situcao_cpf", label: "Situação do CPF", chave: "", show: true },
    { name: "obito", label: "Provável Óbito", chave: "", show: true },
    { name: "ocupacao", label: "Ocupação Profissional", chave: "", show: true },
    { name: "renda", label: "Renda", chave: "", show: true },
    { name: "vinculos", label: "Vínculos", chave: "", show: true },
    { name: "participacao_societaria", label: "Participação Societária", chave: "", show: true },
    { name: "historico_profissional", label: "Histórico Profissional", chave: "", show: true },
    { name: "telefone", label: "Telefone", chave: "", show: true },
    { name: "email", label: "E-Mail", chave: "", show: true },
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
        valor: this.formatarValor(item.chave, dadosObj[item.chave]),
        show: item.show,
        name: item.name
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

    // Para o nome, exibe o primeiro nome e substitui o restante por asteriscos fixos
    if (chave === "nome") {
      const palavras: string[] = valor.toString().split(" ");
      if (palavras.length > 1) {
        const firstWord: string = palavras[0];
        const hiddenWords = palavras.slice(1).map((palavra: string) => "*".repeat(palavra.length));
        return [firstWord, ...hiddenWords].join(" ");
      }
      return valor.toString();
    }



    // Para a data de nascimento, exibe apenas o dia e oculta mês e ano
    if (chave === "data_nascimento") {
      return this.formatarDataOcultada(valor.toString());
    }

    return valor.toString(); // Retorna como string para os demais casos
  }

  formatarDataOcultada(data: string): string {
    // Espera o formato "YYYY-MM-DD"
    const partes = data.split("-");
    if (partes.length === 3) {
      // partes[0]: ano, partes[1]: mês, partes[2]: dia
      // Exibe apenas o dia e substitui o mês e ano por asteriscos, mantendo os separadores
      return `${partes[2]}/${"*".repeat(partes[1].length)}/${"*".repeat(partes[0].length)}`;
    }
    return "N/A";
  }
}
