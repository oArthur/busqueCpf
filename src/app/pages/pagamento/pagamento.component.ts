import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagarMeService } from '../../services/pagar-me.service';
import { TitleComponent } from '../../components/title/title.component';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormResultadoComponent} from '../../components/form-resultado/form-resultado.component';
import {CpfService} from '../../services/cpf.service';

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
export class PagamentoComponent implements OnInit, OnDestroy {
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiPagarme: PagarMeService,
              private cpfApiService: CpfService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cpf = params['cpf'] || null;
      this.id = params['id'] || null;
      this.idPrincipal = params['idPrincipal'] || null;
    //   ID da primeira compra realizada (compra de pedido completo.).
    });
    console.log(`cpf: ${this.cpf}, id_pedido: ${this.id}`)
    if (history.state && history.state['pagamento']) {
      this.pagamento = history.state['pagamento'];
      this.isAdicionais = history.state['isAdicionais'] || false;
      console.log("Dados carregados no componente de pagamento:", this.pagamento);
      this.carregando = false;
      this.iniciarVerificacaoAutomatica();
    } else {
      this.router.navigate(['/']); // Se necessário, redireciona para evitar erro
    }
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
    // TODO parei aqui, estava fazendo a logica de quando o pedido adicional é pago
    this.apiPagarme.getOrderApproved(this.pagamento.id).subscribe({
      next: (statusPago) => {
        if (statusPago) {
          // Se for nova compra, redireciona para o resultado completo automaticamente.
          // Se for compra de itens adicionais, atualiza o status mas não redireciona.
          if (!this.isAdicionais) {
            this.buscaCpfApi();
          } else {
            this.status = "Pagamento aprovado para itens adicionais.";
            // Aqui você pode interromper a verificação automática, se desejar:
            this.buscaCpfApi();
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
  // TODO, mesmo com o pagamento aprovado o usuario não foi redirecionado para o lugar correto.
  buscaCpfApi(){
    clearInterval(this.intervaloVerificacao);
    this.cpfApiService.buscarCpf(this.cpf, true).subscribe({
      next: (response) => {
        this.carregando = false;

        if (response) {
          this.isLoading = false;
          const pathId = this.idPrincipal ? this.idPrincipal : this.id;
          this.router.navigate([`/resultado-completo/${pathId}`], {
            queryParams: { cpf: this.cpf },
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
