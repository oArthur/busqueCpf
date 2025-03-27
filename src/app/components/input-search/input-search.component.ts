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
import {PrecoService} from '../../services/preco.service';

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
  styleUrls: ['./input-search.component.scss']
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
    private cpfService: FormatCpfService,
    private precoService: PrecoService
  ) {
    // Inicializa o FormControl com o validador customizado
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
   */
  cpfValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const cpfNumerico = value.replace(/\D/g, '');
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

    this.precoService.resetPreco()

    this.carregando = true;
    this.buscaPrincipal.disable();

    const cpf = (this.buscaPrincipal.value ?? '').toString().replace(/\D/g, '');

    this.cpfApiService.buscarCpf(cpf, false).subscribe({
      next: (response) => {
        this.carregando = false;
        // Reabilita o controle após a resposta
        this.buscaPrincipal.enable();
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
        this.buscaPrincipal.enable();
        alert('Erro ao buscar CPF. Tente novamente mais tarde.');
      }
    });
  }
}
