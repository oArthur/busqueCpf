import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { FormatCpfService } from '../../services/format-cpf.service';
import { PagarMeService } from '../../services/pagar-me.service';
import { Router } from '@angular/router';
import {NgxMaskDirective} from 'ngx-mask';

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
    private cpfService: FormatCpfService
  ) {}

  contato = new FormGroup({
    nome: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
    cpf: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email])
  });

  carregando = false;
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

    this.apiPagarme.createOrder(user, this.cpfBusca).subscribe({
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

}
