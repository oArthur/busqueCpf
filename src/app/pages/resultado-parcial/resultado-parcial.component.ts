import {AfterViewInit, Component, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { FormResultadoComponent } from '../../components/form-resultado/form-resultado.component';
import { ComoComprarComponent } from '../como-comprar/como-comprar.component';
import { TransparenciaComponent } from '../../components/transparencia/transparencia.component';
import { FormContatoComponent } from '../../components/form-contato/form-contato.component';
import { FormCompraComponent } from '../form-compra/form-compra.component';
import { NgIf } from '@angular/common';
import {PrecoService} from '../../services/preco.service';
import {data} from 'autoprefixer';
import {CpfFormatPipe} from '../../pipes/cpf-format.pipe';

@Component({
  selector: 'app-resultado-parcial',
  standalone: true,
  templateUrl: './resultado-parcial.component.html',
  styleUrls: ['./resultado-parcial.component.scss'],
  imports: [
    FormResultadoComponent,
    ComoComprarComponent,
    TransparenciaComponent,
    FormContatoComponent,
    FormCompraComponent,
    NgIf,
    CpfFormatPipe
  ]
})
export class ResultadoParcialComponent implements AfterViewInit{

  cpf: string | null = null;
  dadosParciais: { icon:string, name: string, label: string, valor: string, show: boolean, adicional: boolean, preco?: number }[] = [];
  carregando: boolean = false;

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { icon: string, name: string, label: string, chave: string, show: boolean, adicional: boolean, preco?: number }[] = [
    { icon:"person", name: "nome", label: "Nome Completo", chave: "nome", show: true, adicional: false },
    { icon:"cake", name: "dta_nascimento", label: "Data de Nascimento", chave: "data_nascimento", show: true, adicional: false },
    { icon:"badge", name: "cpf", label: "CPF", chave: "cpf", show: true, adicional: false },
    { icon:"wc", name: "genero", label: "Gênero", chave: "sexo", show: true, adicional: false },
    { icon:"favorite", name: "estado_civil", label: "Estado Civil", chave: "estado_civil", show: true, adicional: false },
    { icon:"group", name: "nome_mae", label: "Nome da Mãe", chave: "nome_mae", show: true, adicional: false },
    { icon:"request_quote", name: "situcao_cpf", label: "Situação do CPF", chave: "situacao_cpf", show: true, adicional: false },
    { icon:"church", name: "obito", label: "Provável Óbito", chave: "obito", show: true, adicional: false },
    { icon:"business_center", name: "ocupacao", label: "Ocupação Profissional", chave: "ocupacao", show: true, adicional: false },
    { icon:"payments", name: "renda", label: "Renda", chave: "renda", show: true, adicional: false },
    { icon:"stars", name: "signos", label: "Signos", chave: "signos", show: false,adicional: false },
    { icon:"mail", name: "email", label: "E-Mail", chave: "emails", show: true, adicional: false},
    { icon:"diversity_1", name: "vinculos", label: "Vínculos", chave: "vinculos", show: true, adicional: true, preco: 10.90 },
    { icon:"apartment", name: "participacao_societaria", label: "Participação Societária", chave: "participacao_societaria", show: true, adicional: true, preco: 10.90 },
    { icon:"history", name: "historico_profissional", label: "Histórico Profissional", chave: "historico_profissional", show: true, adicional: true, preco: 10.90 },
    { icon:"phone", name: "telefone", label: "Telefone", chave: "telefones", show: true, adicional: true, preco: 15.90 },
  ];

  constructor(private router: Router, private precoService: PrecoService, private renderer: Renderer2,
              private cpfPipe: CpfFormatPipe) {
    this.carregando = true;
    this.precoService.resetPreco()
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
        preco: item.preco,
        icon: item.icon
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
    if (!valor) return ""; // Caso o valor seja nulo ou indefinido

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
    if (chave === "cpf"){
      return this.cpfPipe.transform(valor)
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

  injetarScriptConversao(): void {
    const script = this.renderer.createElement('script');
    script.text = `gtag('event', 'conversion', {'send_to': 'AW-16888294718/SqpiCKiHh7YaEL7a-_Q-'});`;
    this.renderer.appendChild(document.body, script);
  }

  ngAfterViewInit(): void {
    this.injetarScriptConversao()
  }
}
