import {Component, Input} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {FormatCpfService} from '../../services/format-cpf.service';
import {PagarMeService} from '../../services/pagar-me.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form-contato',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './form-contato.component.html',
  styleUrl: './form-contato.component.scss'
})
export class FormContatoComponent {

  constructor(private apiPagarme: PagarMeService, private router: Router, private cpfService: FormatCpfService) {
  }

  contato = new FormGroup({
    nome: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
    cpf: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email])
  });

  carregando = false;
  @Input() cpfBusca!:string;


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

          console.log(`Resposta da API no form-contato: ${response}`)

          // Passando os dados via Router State
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

  formatCpf() {
    let cpfControl = this.contato.get('cpf');
    if (cpfControl) {
      const formattedCpf = this.cpfService.formatCpf(cpfControl.value || '');
      cpfControl.setValue(formattedCpf, { emitEvent: false });

      const cpfNumerico = formattedCpf.replace(/\D/g, '');
      cpfControl.setErrors(this.cpfService.validarCpf(cpfNumerico) ? null : { invalidCpf: true });
    }
  }
}
