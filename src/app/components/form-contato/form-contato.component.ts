import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatCpfService } from '../../services/format-cpf.service';
import { PagarMeService } from '../../services/pagar-me.service';
import { NgxMaskDirective } from 'ngx-mask';
import { CupomService } from '../../services/cupom.service';
import { CupomResponse } from '../../interfaces';
import { PrecoService } from '../../services/preco.service';
import { AdicionaisService } from '../../services/adicionais.service';

@Component({
  selector: 'app-form-contato',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgxMaskDirective
  ],
  templateUrl: './form-contato.component.html',
  styleUrl: './form-contato.component.scss'
})
export class FormContatoComponent implements OnInit {
  // Variável para armazenar o idPedido recebido via rota (opcional)
  idPedido: string | null = null;

  constructor(
    private apiPagarme: PagarMeService,
    private router: Router,
    private route: ActivatedRoute,
    private cpfService: FormatCpfService,
    private cupomService: CupomService,
    private precoService: PrecoService,
    private adicionaisService: AdicionaisService
  ) {}

  contato = new FormGroup({
    nome: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
    cpf: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    cupom: new FormControl<string | null>(''),
  });

  carregando = false;
  cupomAplicado: boolean = false;
  cupomExistente: boolean = false;
  labelCupom!: string;
  cupom!: CupomResponse;
  @Input() cpfBusca!: string;

  ngOnInit(): void {
    // Se a rota estiver configurada como /resultado-completo/:id,
    // recupera o parâmetro "id"
    this.route.paramMap.subscribe(params => {
      this.idPedido = params.get('id');
      console.log('idPedido:', this.idPedido);
    });
  }

  onSubmit() {
    if (this.contato.invalid) {
      console.log("Formulário inválido!");
      return;
    }

    this.carregando = true;

    const user = {
      nome: this.contato.value.nome!,
      email: this.contato.value.email!,
      document: this.contato.value.cpf!
    };

    // Recupera os itens adicionais selecionados (string[])
    const itensAdicionais = this.adicionaisService.getSelectedItems();
    const adicionaisParaEnviar = itensAdicionais.length ? itensAdicionais : undefined;
    const isAdicionais = !!adicionaisParaEnviar;

    // Se idPedido existir, significa que é uma compra de item adicional.
    // Ajuste a chamada de createOrder para receber esse parâmetro opcional, se necessário.
    this.apiPagarme.createOrder(user, this.cpfBusca, this.cupom, adicionaisParaEnviar,
      this.idPedido || undefined).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response && response.id) {
          console.log(`Resposta da API no form-contato: ${response}`);
          this.router.navigate(['/pagamento'], {
            queryParams: {
              cpf: this.cpfBusca,
              id: response.id,
              ...(this.idPedido ? { idPrincipal: this.idPedido } : {})
            },
            state: { pagamento: response, isAdicionais }
          });

        } else {
          alert("Erro ao gerar pedido. Tente novamente.");
        }
      },
      error: () => {
        this.carregando = false;
        alert("Erro ao processar pagamento. Tente novamente mais tarde.");
      }
    });
  }

  campoInvalido(campo: string): boolean {
    return !!(this.contato.get(campo)?.invalid && this.contato.get(campo)?.touched);
  }

  formatCpf() {
    let cpfControl = this.contato.get('cpf');
    if (cpfControl) {
      const cpfNumerico = (cpfControl.value || '').replace(/\D/g, '');
      cpfControl.setErrors(
        this.cpfService.validarCpf(cpfNumerico) ? null : { invalidCpf: true }
      );
    }
  }

  aplicarCupom() {
    const cupomControl = this.contato.get('cupom');
    if (cupomControl && cupomControl.value) {
      const cupomValue: string = cupomControl.value as string;
      this.cupomService.searchCupom(cupomValue).subscribe({
        next: (res) => {
          this.labelCupom = res.cupom.description;
          this.precoService.aplicarDesconto(res.cupom.discount);
          this.cupomAplicado = true;
          this.cupomExistente = res.cupom.exists;
          this.cupom = res;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
