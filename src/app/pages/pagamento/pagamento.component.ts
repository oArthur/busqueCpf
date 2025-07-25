import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagarMeService } from '../../services/pagar-me.service';
import { TitleComponent } from '../../components/title/title.component';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormResultadoComponent} from '../../components/form-resultado/form-resultado.component';
import {CpfService} from '../../services/cpf.service';
import {CupomService} from '../../services/cupom.service';
import {IGenerateCupom} from '../../interfaces';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  standalone: true,
  imports: [
    TitleComponent,
    NgIf,
    FormResultadoComponent,
    CurrencyPipe
  ],
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit, OnDestroy, AfterViewInit {
  pagamento: any = {};
  status = "Pendente";
  carregando = true;
  intervaloVerificacao: any;
  isLoading = true
  cpf!: string;
  id!: string;
  idPrincipal!: string;
  tentativas:number = 0;
  maxTentativas:number = 13;
  isAdicionais: boolean = false;
  pacote: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiPagarme: PagarMeService,
              private cpfApiService: CpfService,
              private cupomService: CupomService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cpf = params['cpf'] || null;
      this.id = params['id'] || null;
      this.idPrincipal = params['idPrincipal'] || null;
    });

    if (history.state && history.state['pagamento']) {
      this.pagamento = history.state['pagamento'];
      this.isAdicionais = history.state['isAdicionais'] || false;
      this.pacote = history.state['pacote'] || null;


      this.carregando = false;
      this.iniciarVerificacaoAutomatica();
    } else {
      this.router.navigate(['/']); // Redireciona se não houver state esperado
    }
  }

  ngAfterViewInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }




  iniciarVerificacaoAutomatica() {
    this.intervaloVerificacao = setInterval(() => {
      if (this.tentativas >= this.maxTentativas) {
        clearInterval(this.intervaloVerificacao);
        this.status = "Tempo limite excedido. Verifique manualmente.";
        return;
      }

      this.verificarPagamento();
      this.tentativas++;
    }, 10000); // Verifica a cada 10 segundos
  }

  verificarPagamento() {
    if (!this.pagamento.id) return;
    this.apiPagarme.getOrderApproved(this.pagamento.id).subscribe({
      next: (statusPago) => {
        if (statusPago) {
          // Se for nova compra, redireciona para o resultado completo automaticamente.
          // Se for compra de itens adicionais, atualiza o status mas não redireciona.
          if (!this.isAdicionais && !this.pacote) {
            this.buscaCpfApi("result_paid");
          } else if (this.pacote){
            this.redirectPacote()
          } else {
            this.status = "Pagamento aprovado para itens adicionais.";
            // Aqui você pode interromper a verificação automática, se desejar:
            this.buscaCpfApi("result_upsell");
            clearInterval(this.intervaloVerificacao);
          }
        } else {
          this.status = "Aguardando pagamento...";
        }
      },
      error: () => {
        this.status = "Erro ao verificar pagamento.";
        this.isLoading = false;
      }
    });
  }

  redirectPacote(){
    clearInterval(this.intervaloVerificacao);
    this.cupomService.generateCupom(this.id, this.cpf).subscribe({
      next: (res: IGenerateCupom) => {
        this.carregando = false;

        if (res.success){
          this.router.navigate(["/obrigado-pacote"], {
            state: {cupom: res.code, limite: res.limite}
          })
        }else {
          console.log("Pedido não encontrado.")
        }
      },
      error: () => {
        this.carregando = false

        alert("Error ao gerar cupom. Tente novamente mais tarde!")
      }
    })

  }
  buscaCpfApi(tipo_compra: string){
    clearInterval(this.intervaloVerificacao);
    this.cpfApiService.buscarCpf(this.cpf, true, this.pagamento.id).subscribe({
      next: (response) => {
        this.carregando = false;

        if (response) {
          this.isLoading = false;
          const pathId = this.idPrincipal ? this.idPrincipal : this.id;
          this.router.navigate([`/resultado-completo/${pathId}`], {
            queryParams: { cpf: this.cpf, status: tipo_compra },
            state: { dados: response, cpf: this.cpf }
          });
        } else {
          alert("CPF não encontrado ou bloqueado.");
        }
      },
      error: () => {
        this.carregando = false;
        alert("Erro ao buscar CPF. Tente novamente mais tarde.");
      }
    });
  }


  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value).then(() => {
      alert("Código Pix copiado para a área de transferência!");
    });
  }

  ngOnDestroy() {
    if (this.intervaloVerificacao) {
      clearInterval(this.intervaloVerificacao);
    }
  }
}
