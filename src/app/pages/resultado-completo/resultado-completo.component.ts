import {Component, OnDestroy, OnInit} from '@angular/core';
import { ComoComprarComponent } from "../como-comprar/como-comprar.component";
import { FormCompraComponent } from "../form-compra/form-compra.component";
import { FormResultadoComponent } from "../../components/form-resultado/form-resultado.component";
import { TransparenciaComponent } from "../../components/transparencia/transparencia.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CpfService } from '../../services/cpf.service';
import {BdPedidosService} from '../../services/bd-pedidos.service';
import {CurrencyPipe, NgIf} from '@angular/common';
import {PrecoService} from '../../services/preco.service';
import {Subscription} from 'rxjs';
import {CpfFormatPipe} from '../../pipes/cpf-format.pipe';

@Component({
  selector: 'app-resultado-completo',
  standalone: true,
  imports: [
    ComoComprarComponent,
    FormCompraComponent,
    FormResultadoComponent,
    TransparenciaComponent,
    CpfFormatPipe,
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
  dadosCompletos: { name: string, label: string, valor: string, show: boolean, adicional: boolean, preco?: number }[] = [];

  constructor(private router: Router, private cpfApiService: CpfService, private route: ActivatedRoute,
              private bdPedidosService: BdPedidosService, private precoService: PrecoService, private cpfPipe: CpfFormatPipe) {}

  // Labels fixas que sempre aparecem na tela
  labelsFixas: { icon: string, name: string, label: string, chave: string, show: boolean, adicional: boolean, preco?: number }[] = [
    { icon:"person", name: "nome", label: "Nome Completo", chave: "nome", show: true,adicional: false},
    { icon:"badge", name: "cpf", label: "CPF", chave: "cpf", show: true,adicional: false },
    { icon:"cake", name: "dta_nascimento", label: "Data de Nascimento", chave: "data_nascimento", show: true,adicional: false },
    { icon:"wc", name: "genero", label: "Gênero", chave: "sexo", show: true,adicional: false },
    { icon:"request_quote", name: "situcao_cpf", label: "Situação do CPF", chave: "situacao_cpf", show: true,adicional: false },
    { icon:"church", name: "obito", label: "Provável Óbito", chave: "obito", show: true,adicional: false },
    { icon:"business_center", name: "ocupacao", label: "Ocupação Profissional", chave: "ocupacao", show: true,adicional: false },
    { icon:"payments", name: "renda", label: "Renda", chave: "renda", show: true,adicional: false },
    { icon:"stars", name: "signos", label: "Signos", chave: "signos", show: false,adicional: false },
    { icon:"diversity_1", name: "vinculos", label: "Vínculos", chave: "vinculos", show: true, adicional: true, preco: 10.90 },
    { icon:"apartment", name: "participacao_societaria", label: "Participação Societária", chave: "participacao_societaria", show: true, adicional: true, preco: 12.90 },
    { icon:"history", name: "historico_profissional", label: "Histórico Profissional", chave: "historico_profissional", show: true, adicional: true, preco: 10.90 },
    { icon:"phone", name: "telefones", label: "Telefones", chave: "telefones", show: true, adicional: true, preco: 15.90 },
    { icon:"mail", name: "emails", label: "E-Mails", chave: "emails", show: false, adicional: false },
    { icon: "home_pin", name: "enderecos", label: "Endereços", chave: "enderecos", show: true, adicional: true, preco: 12.90 }
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

    const scriptId = 'google-ads-script';

    if (!document.getElementById(scriptId)) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16888294718';
      gtagScript.id = scriptId;
      document.head.appendChild(gtagScript);

      const inlineScript = document.createElement('script');
      inlineScript.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-16888294718');
  `;
      document.head.appendChild(inlineScript);
    }
  }

  montarDados(dados: any) {
    this.dadosCompletos = this.labelsFixas.map(item => {
      const valorOriginal = dados[item.chave];

      let valorFormatado = valorOriginal;

      // Formata apenas campos simples (string, número)
      if (typeof valorOriginal === 'string' || typeof valorOriginal === 'number') {
        valorFormatado = this.formatarValor(item.chave, valorOriginal);
      }

      return {
        label: item.label,
        valor: valorFormatado,
        name: item.name,
        show: item.show,
        adicional: item.adicional,
        preco: item.preco,
        icon: item.icon
      };
    });
  }


  formatarValor(chave: string, valor: any): string {
    if (!valor) return "";

    if (chave === "data_nascimento") {
      const [yyyy, mm, dd] = valor.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }

    if (chave === "cpf") {
      return this.cpfPipe.transform(valor);
    }

    if (chave === "renda") {
      const numero = Number(valor);
      if (isNaN(numero)) return "Sem registro";

      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      }).format(numero);
    }

    return valor.toString();
  }


  buscaCpfApi() {
    this.carregando = true;

    this.bdPedidosService.verificarStatusPedido(this.id, this.cpf).subscribe({
      next: (result: string[]) => {
        // Se não há itens, significa pedido não validado
        if (!Array.isArray(result) || result.length === 0) {
          this.carregando = false;
          alert("Pedido não validado ou pagamento não aprovado.");
          this.router.navigate(['/']);
          return;  // interrompe o fluxo
        }

        // Só continua aqui se result tiver ao menos um item
        this.itensJaComprados = result;
        console.log(this.itensJaComprados);

        this.precoService.setPreco(0);
        this.cpfApiService.buscarCpf(this.cpf, true, this.itensJaComprados)
          .subscribe({
            next: (response: any[]) => {
              this.carregando = false;
              if (response && response.length > 0) {
                const dadosObj = response[0];
                this.montarDados(dadosObj);
                console.log(response[0])
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
