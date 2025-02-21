import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagarMeService } from '../../services/pagar-me.service';
import { TitleComponent } from '../../components/title/title.component';
import { NgIf } from '@angular/common';
import {FormResultadoComponent} from '../../components/form-resultado/form-resultado.component';
import {CpfService} from '../../services/cpf.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  standalone: true,
  imports: [
    TitleComponent,
    NgIf,
    FormResultadoComponent
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
  tentativas:number = 0;
  maxTentativas:number = 13;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiPagarme: PagarMeService,
              private cpfApiService: CpfService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cpf = params['cpf'] || null;
      this.id = params['id'] || null;
    });
    console.log(`cpf: ${this.cpf}, id_pedido: ${this.id}`)
    if (history.state && history.state['pagamento']) {
      this.pagamento = history.state['pagamento'];
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

    this.apiPagarme.getOrderApproved(this.pagamento.id).subscribe({
      next: (statusPago) => {
        if (statusPago) {
          this.buscaCpfApi()
        } else {
          this.status = "Aguardando pagamento...";
        }
      },
      error: () => {
        this.status = "Erro ao verificar pagamento.";
        this.isLoading = false
      }
    });
  }

  buscaCpfApi(){
    clearInterval(this.intervaloVerificacao);
    this.cpfApiService.buscarCpf(this.cpf, true).subscribe({
      next: (response) => {
        this.carregando = false;

        if (response) {
          this.isLoading = false
          this.router.navigate([`/resultado/${this.id}`], {
            queryParams: {cpf: this.cpf},
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
