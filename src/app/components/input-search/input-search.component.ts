import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CpfService } from '../../services/cpf.service';
import { FormatCpfService } from '../../services/format-cpf.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxMaskDirective
  ],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss'
})
export class InputSearchComponent {
  @Input() title: string = '';

  // Cria o FormControl com Validators.required e o validador customizado
  buscaPrincipal: FormControl;
  cpfInvalido: boolean = false;
  cpfCompleto: boolean = false;
  carregando: boolean = false;

  constructor(
    private cpfApiService: CpfService,
    private router: Router,
    private cpfService: FormatCpfService
  ) {
    // Inicializa o FormControl com o validador customizado (usando bind para acessar o serviço)
    this.buscaPrincipal = new FormControl('', [
      Validators.required,
      this.cpfValidator.bind(this)
    ]);

    // Inscreve para atualizar flags conforme o valor muda
    this.buscaPrincipal.valueChanges.subscribe(value => {
      const cpfNumerico = (value || '').replace(/\D/g, '');
      this.cpfCompleto = cpfNumerico.length === 11;
      this.cpfInvalido = this.buscaPrincipal.invalid;
    });
  }

  /**
   * Validador customizado para CPF.
   * Remove caracteres não numéricos e, se houver 11 dígitos, usa o serviço para validar.
   */
  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const cpfNumerico = value.replace(/\D/g, '');
    // Se vazio, a validação de required cuidará disso
    if (!value) return null;
    if (cpfNumerico.length !== 11) {
      return { cpfInvalid: true };
    }
    if (!this.cpfService.validarCpf(cpfNumerico)) {
      return { cpfInvalid: true };
    }
    return null;
  }

  /**
   * Submete o CPF para busca, somente se o FormControl for válido.
   */
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.buscaPrincipal.invalid) return;

    this.carregando = true;
    const cpf = (this.buscaPrincipal.value ?? '').toString().replace(/\D/g, '');

    this.cpfApiService.buscarCpf(cpf, false).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response) {
          this.router.navigate(['/resultado'], {
            state: { dados: response, cpf: cpf }
          });
        } else {
          alert('CPF não encontrado ou bloqueado.');
        }
      },
      error: () => {
        this.carregando = false;
        alert('Erro ao buscar CPF. Tente novamente mais tarde.');
      }
    });
  }
}
