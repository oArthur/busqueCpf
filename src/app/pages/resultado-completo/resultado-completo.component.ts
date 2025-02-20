import { Component, OnInit } from '@angular/core';
import { ComoComprarComponent } from "../como-comprar/como-comprar.component";
import { FormCompraComponent } from "../form-compra/form-compra.component";
import { FormResultadoComponent } from "../../components/form-resultado/form-resultado.component";
import { TransparenciaComponent } from "../../components/transparencia/transparencia.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CpfService } from '../../services/cpf.service';
import {PagarMeService} from '../../services/pagar-me.service';
import {BdPedidosService} from '../../services/bd-pedidos.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-resultado-completo',
  standalone: true,
  imports: [
    ComoComprarComponent,
    FormCompraComponent,
    FormResultadoComponent,
    TransparenciaComponent,
    NgIf
  ],
  templateUrl: './resultado-completo.component.html',
  styleUrl: './resultado-completo.component.scss'
})
export class ResultadoCompletoComponent implements OnInit {
  cpf!: string;
  id!: string;
  carregando: boolean = false;
  dadosParciais: { label: string; valor: string }[] = [];

  constructor(private router: Router, private cpfApiService: CpfService, private route: ActivatedRoute, private bdPedidosService: BdPedidosService) {}

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { label: string, chave: string }[] = [
    { label: "Nome Completo", chave: "nome" },
    { label: "Gênero", chave: "sexo" },
    { label: "Data de Nascimento", chave: "data_nascimento" },
    { label: "Nome da Mãe", chave: "nome_mae" },
    { label: "Situação do CPF", chave: "situacao_cpf" },
    { label: "Provável Óbito", chave: "obito" },
    { label: "Ocupação Profissional", chave: "ocupacao" },
    { label: "Renda", chave: "renda" },
    { label: "Vínculos", chave: "vinculos" },
    { label: "Participação Societária", chave: "participacao_societaria" },
    { label: "Histórico Profissional", chave: "historico_profissional" },
    { label: "WhatsApp", chave: "telefones" },
    { label: "Telefone", chave: "telefones" },
    { label: "E-Mail", chave: "emails" },
    { label: "Endereço", chave: "enderecos" }
  ];

  ngOnInit() {
    this.carregando = true
    this.route.queryParams.subscribe(params => {
      this.cpf = params['cpf'] || null;
    });
    this.id = this.route.snapshot.paramMap.get('id') || '';

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['dados']) {
      // Se os dados vieram pelo state do Router
      const dadosRecebidos = navigation.extras.state['dados'];
      this.cpf = navigation.extras.state['cpf'];

      // Se for um array, pega o primeiro item
      const dadosObj = Array.isArray(dadosRecebidos) && dadosRecebidos.length > 0 ? dadosRecebidos[0] : {};
      this.montarDados(dadosObj);
      this.carregando = false
    } else if (this.cpf) {
      // Se o state está vazio, mas o CPF veio via query param, busca na API
      this.buscaCpfApi();
    } else {
      // Se não há CPF, exibe um erro
      alert("Nenhum CPF fornecido para consulta.");
    }
  }

  /**
   * Monta os dados para exibição formatada
   */
  montarDados(dados: any) {
    this.dadosParciais = this.labelsFixas.map(item => ({
      label: item.label,
      valor: this.formatarValor(item.chave, dados[item.chave])
    }));
  }

  /**
   * Formata os valores para garantir legibilidade, tratando listas corretamente.
   */
  formatarValor(chave: string, valor: any): string {
    if (valor === null || valor === undefined || valor === "") return "Não informado";

    if (chave === "data_nascimento") {
      return this.formatarData(valor);
    }
    if (chave === "obito") {
      return valor ? "Sim" : "Não";
    }
    if (chave === "renda") {
      return valor ? `R$ ${valor.toFixed(2)}` : "Não informado";
    }
    if (chave === "telefones") {
      return valor.length > 0
        ? valor.map((t: any) => `${t.ddd} ${t.numero} ${t.whatsapp ? "(WhatsApp)" : ""}`).join(" | ")
        : "Não informado";
    }
    if (chave === "emails") {
      return valor.length > 0 ? valor.join(", ") : "Não informado";
    }
    if (chave === "enderecos") {
      return valor.length > 0
        ? valor.map((e: any) => `${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.uf}, CEP: ${e.cep}`).join(" | ")
        : "Não informado";
    }
    if (chave === "participacao_societaria") {
      return valor.length > 0
        ? valor.map((p: any) => `Entrada: ${p.dataEntrada} | Empresa: ${p.razaoSocial} (${p.cnpj}) | Cargo: ${p.cargo}`).join("\n")
        : "Não possui";
    }
    if (chave === "vinculos" || chave === "historico_profissional") {
      return valor.length > 0 ? valor.map((v: any) => JSON.stringify(v)).join(" | ") : "Nenhum";
    }

    return valor.toString(); // Retorna como string se não for uma lista
  }


  formatarData(data: string): string {
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return "N/A";
  }

  buscaCpfApi() {
    this.carregando = true;

    this.bdPedidosService.verificarStatusPedido(this.id, this.cpf).subscribe({
      next: (pagamentoAprovado) => {
        if (pagamentoAprovado) {
          // Se pagamento está aprovado, busca os dados do CPF
          this.cpfApiService.buscarCpf(this.cpf, true).subscribe({
            next: (response) => {
              this.carregando = false;
              if (response) {
                const dadosObj = Array.isArray(response) && response.length > 0 ? response[0] : {};
                this.montarDados(dadosObj);
              } else {
                alert("CPF não encontrado ou bloqueado.");
                this.router.navigate(['/']); // Redireciona caso CPF não seja encontrado
              }
            },
            error: () => {
              this.carregando = false;
              alert("Erro ao buscar CPF. Tente novamente mais tarde.");
              this.router.navigate(['/']); // Redireciona em caso de erro
            }
          });
        } else {
          // Se pagamento não está aprovado, redireciona
          this.carregando = false;
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.carregando = false;
        alert("Erro ao verificar pagamento. Tente novamente mais tarde.");
        this.router.navigate(['/']);
      }
    });
  }
}
