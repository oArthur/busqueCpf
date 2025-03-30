import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { FormatCpfService } from '../../services/format-cpf.service';
import { PagarMeService } from '../../services/pagar-me.service';
import { Router } from '@angular/router';
import {NgxMaskDirective} from 'ngx-mask';
import {CupomService} from '../../services/cupom.service';
import {CupomResponse} from '../../interfaces';
import {PrecoService} from '../../services/preco.service';
import {AdicionaisService} from '../../services/adicionais.service';

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
export class FormContatoComponent {

  constructor(
    private apiPagarme: PagarMeService,
    private router: Router,
    private cpfService: FormatCpfService,
    private cupomService: CupomService,
    private precoService: PrecoService,
    private adicionaisService: AdicionaisService
  ) {}

  contato = new FormGroup({
    nome: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
    cpf: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    cupom: new FormControl<string | null>('',)
  });

  carregando = false;
  cupomAplicado: boolean = false;
  cupomExistente: boolean = false;
  labelCupom!: string;
  cupom!: CupomResponse;
  @Input() cpfBusca!: string;

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

    this.apiPagarme.createOrder(user, this.cpfBusca, this.cupom, adicionaisParaEnviar).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response && response.id) {
          const pedidoId = response.id;
          console.log(`Resposta da API no form-contato: ${response}`);
          this.router.navigate(['/pagamento'], {
            queryParams: { cpf: this.cpfBusca, id: response.id },
            state: { pagamento: response }
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

  /**
   * Aplica a máscara e valida o CPF.
   * A função utiliza o serviço para formatar o CPF e, em seguida,
   * remove os caracteres não numéricos para validar o CPF.
   */
  formatCpf() {
    let cpfControl = this.contato.get('cpf');
    if (cpfControl) {
      // Remove os caracteres não numéricos para obter apenas os dígitos
      const cpfNumerico = (cpfControl.value || '').replace(/\D/g, '');
      // Define erros se o CPF não for válido, conforme seu serviço
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
          this.precoService.aplicarDesconto(res.cupom.discount)
          this.cupomAplicado = true;
          this.cupomExistente = res.cupom.exists
          this.cupom = res;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }


}
