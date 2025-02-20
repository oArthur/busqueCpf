import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagarMeService } from '../../services/pagar-me.service';
import { TitleComponent } from '../../components/title/title.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  standalone: true,
  imports: [
    TitleComponent,
    NgIf
  ],
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit, OnDestroy {
  pagamento: any = {};
  status = "Pendente";
  carregando = true;
  intervaloVerificacao: any;

  constructor(private route: ActivatedRoute, private router: Router, private apiPagarme: PagarMeService) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      this.pagamento = navigation.extras.state['pagamento'];
      this.carregando = false;
      this.iniciarVerificacaoAutomatica();
    } else {
      this.router.navigate(['/']); // Redireciona se não houver dados
    }
  }

  iniciarVerificacaoAutomatica() {
    this.intervaloVerificacao = setInterval(() => {
      this.verificarPagamento();
    }, 10000); // Verifica a cada 10 segundos
  }

  verificarPagamento() {
    if (!this.pagamento.id) return;

    this.apiPagarme.getOrderApproved(this.pagamento.id).subscribe({
      next: (statusPago) => {
        if (statusPago) {
          clearInterval(this.intervaloVerificacao); // Para a verificação automática
          this.router.navigate(['/resultado-completo'], { queryParams: { id: this.pagamento.id } });
        } else {
          this.status = "Aguardando pagamento...";
        }
      },
      error: () => {
        this.status = "Erro ao verificar pagamento.";
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
