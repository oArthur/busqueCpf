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
  dadosParciais: { name: string, label: string, valor: string, show: boolean }[] = [];

  constructor(private router: Router, private cpfApiService: CpfService, private route: ActivatedRoute, private bdPedidosService: BdPedidosService) {}

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { name: string, label: string, chave: string, show: boolean }[] = [
    { name: "nome", label: "Nome Completo", chave: "nome", show: true},
    { name: "genero", label: "Gênero", chave: "sexo", show: true },
    { name: "dta_nascimento", label: "Data de Nascimento", chave: "data_nascimento", show: true },
    { name: "nome_mae", label: "Nome da Mãe", chave: "nome_mae", show: true },
    { name: "cpf", label: "CPF", chave: "cpf", show: true },
    { name: "situcao_cpf", label: "Situação do CPF", chave: "situacao_cpf", show: true },
    { name: "obito", label: "Provável Óbito", chave: "obito", show: true },
    { name: "ocupacao", label: "Ocupação Profissional", chave: "ocupacao", show: true },
    { name: "renda", label: "Renda", chave: "renda", show: true },
    { name: "vinculos", label: "Vínculos", chave: "vinculos", show: false },
    { name: "participacao_societaria", label: "Participação Societária", chave: "participacao_societaria", show: false },
    { name: "historico_profissional", label: "Histórico Profissional", chave: "historico_profissional", show: false },
    { name: "telefone", label: "Telefone", chave: "telefones", show: false },
    { name: "email", label: "E-Mail", chave: "emails", show: false },
    { name: "enderecos", label: "Endereço", chave: "enderecos", show: false }
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

  montarDados(dados: any) {
    this.dadosParciais = this.labelsFixas.map(item => ({
      label: item.label,
      valor: dados[item.chave],
      name: item.name,
      show: item.show
    }));
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
