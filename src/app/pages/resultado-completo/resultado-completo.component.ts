import {Component, OnDestroy, OnInit} from '@angular/core';
import { ComoComprarComponent } from "../como-comprar/como-comprar.component";
import { FormCompraComponent } from "../form-compra/form-compra.component";
import { FormResultadoComponent } from "../../components/form-resultado/form-resultado.component";
import { TransparenciaComponent } from "../../components/transparencia/transparencia.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CpfService } from '../../services/cpf.service';
import {BdPedidosService} from '../../services/bd-pedidos.service';
import {NgIf} from '@angular/common';
import {PrecoService} from '../../services/preco.service';
import {Subscription} from 'rxjs';

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
export class ResultadoCompletoComponent implements OnInit, OnDestroy {
  cpf!: string;
  id!: string;
  carregando: boolean = false;
  preco: number = 0;
  private precoSubscription!: Subscription;
  public itensJaComprados: string[] = [];
  dadosParciais: { name: string, label: string, valor: string, show: boolean, adicional: boolean, preco?: number }[] = [];

  constructor(private router: Router, private cpfApiService: CpfService, private route: ActivatedRoute, private bdPedidosService: BdPedidosService, private precoService: PrecoService) {}

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { name: string, label: string, chave: string, show: boolean, adicional: boolean, preco?: number }[] = [
    { name: "nome", label: "Nome Completo", chave: "nome", show: true,adicional: false},
    { name: "genero", label: "Gênero", chave: "sexo", show: true,adicional: false },
    { name: "dta_nascimento", label: "Data de Nascimento", chave: "data_nascimento", show: true,adicional: false },
    { name: "nome_mae", label: "Nome da Mãe", chave: "nome_mae", show: true,adicional: false },
    { name: "cpf", label: "CPF", chave: "cpf", show: true,adicional: false },
    { name: "situcao_cpf", label: "Situação do CPF", chave: "situacao_cpf", show: true,adicional: false },
    { name: "obito", label: "Provável Óbito", chave: "obito", show: true,adicional: false },
    { name: "ocupacao", label: "Ocupação Profissional", chave: "ocupacao", show: true,adicional: false },
    { name: "renda", label: "Renda", chave: "renda", show: true,adicional: false },
    { name: "vinculos", label: "Vínculos", chave: "vinculos", show: true, adicional: true, preco: 10.90 },
    { name: "participacao_societaria", label: "Participação Societária", chave: "participacao_societaria", show: true, adicional: true, preco: 12.90 },
    { name: "historico_profissional", label: "Histórico Profissional", chave: "historico_profissional", show: true, adicional: true, preco: 10.90 },
    { name: "telefones", label: "Telefone", chave: "telefones", show: true, adicional: true, preco: 15.90 },
    { name: "emails", label: "E-Mail", chave: "emails", show: false, adicional: false },
    { name: "enderecos", label: "Endereço", chave: "enderecos", show: true, adicional: true, preco: 12.90 }
  ];

  ngOnInit() {
    this.carregando = true
    this.precoService.resetPreco()
    this.precoSubscription = this.precoService.preco$.subscribe(value => {
      this.preco = value;
    });
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
      show: item.show,
      adicional: item.adicional,
      preco: item.preco
    }));
  }

  buscaCpfApi() {
    this.carregando = true;

    this.bdPedidosService.verificarStatusPedido(this.id, this.cpf).subscribe({
      next: (result: any) => {
        // Garante que result seja um array de strings; se não, atribui um array vazio.
        this.itensJaComprados = Array.isArray(result) ? result : [];
        console.log(this.itensJaComprados)

        // Continua com o fluxo
        this.precoService.setPreco(0);
        this.cpfApiService.buscarCpf(this.cpf, true, this.itensJaComprados).subscribe({
          next: (response) => {
            this.carregando = false;
            if (response) {
              const dadosObj = Array.isArray(response) && response.length > 0 ? response[0] : {};
              this.montarDados(dadosObj);
            } else {
              alert("CPF não encontrado ou bloqueado.");
              this.router.navigate(['/']);
            }
          },
          error: () => {
            this.carregando = false;
            alert("Erro ao buscar CPF. Tente novamente mais tarde.");
            this.router.navigate(['/']);
          }
        });
      },
      error: () => {
        this.carregando = false;
        alert("Erro ao verificar pagamento. Tente novamente mais tarde.");
        this.router.navigate(['/']);
      }
    });


  }
  ngOnDestroy() {
    if (this.precoSubscription) {
      this.precoSubscription.unsubscribe();
    }
  }
}
