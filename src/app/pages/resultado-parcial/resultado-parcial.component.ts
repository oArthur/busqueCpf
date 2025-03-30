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
  dadosParciais: { name: string, label: string, valor: string, show: boolean, adicional: boolean, preco?: number }[] = [];
  carregando: boolean = false;

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { name: string, label: string, chave: string, show: boolean, adicional: boolean, preco?: number }[] = [
    { name: "nome", label: "Nome Completo", chave: "nome", show: true, adicional: false },
    { name: "genero", label: "Gênero", chave: "sexo", show: true, adicional: false },
    { name: "dta_nascimento", label: "Data de Nascimento", chave: "data_nascimento", show: true, adicional: false },
    { name: "nome_mae", label: "Nome da Mãe", chave: "nome_mae", show: true, adicional: false },
    { name: "cpf", label: "CPF", chave: "cpf", show: true, adicional: false },
    { name: "situcao_cpf", label: "Situação do CPF", chave: "situacao_cpf", show: true, adicional: false },
    { name: "obito", label: "Provável Óbito", chave: "obito", show: true, adicional: false },
    { name: "ocupacao", label: "Ocupação Profissional", chave: "ocupacao", show: true, adicional: false },
    { name: "renda", label: "Renda", chave: "renda", show: true, adicional: false },
    { name: "vinculos", label: "Vínculos", chave: "vinculos", show: true, adicional: true, preco: 10.90 },
    { name: "participacao_societaria", label: "Participação Societária", chave: "participacao_societaria", show: true, adicional: true, preco: 10.90 },
    { name: "historico_profissional", label: "Histórico Profissional", chave: "historico_profissional", show: true, adicional: true, preco: 10.90 },
    { name: "telefone", label: "Telefone", chave: "telefones", show: true, adicional: true, preco: 15.90 },
    { name: "email", label: "E-Mail", chave: "emails", show: true, adicional: true, preco: 10.90 },
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
        name: item.name,
        adicional: item.adicional,
        preco: item.preco
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
