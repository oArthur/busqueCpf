import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {CpfService} from '../../services/cpf.service';
import {FormatCpfService} from '../../services/format-cpf.service';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss'
})
export class InputSearchComponent {
  @Input() title: string = '';

  buscaPrincipal = new FormControl('', [Validators.required]);
  cpfInvalido: boolean = false;
  cpfCompleto: boolean = false;
  carregando: boolean = false;

  constructor(private cpfApiService: CpfService, private router: Router, private cpfService: FormatCpfService) {}

  /**
   * Aplica a máscara de CPF e valida
   */
  formatCpf(value: string = '') {
    const formattedValue = this.cpfService.formatCpf(value);
    this.buscaPrincipal.setValue(formattedValue, { emitEvent: false });

    const cpfNumerico = value.replace(/\D/g, '');
    this.cpfCompleto = cpfNumerico.length === 11;
    this.cpfInvalido = this.cpfCompleto && !this.cpfService.validarCpf(cpfNumerico);
  }

  /**
   * Submete o CPF para busca
   */
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.cpfInvalido) return;

    this.carregando = true;
    const cpf = (this.buscaPrincipal.value ?? '').toString().replace(/\D/g, '');

    this.cpfApiService.buscarCpf(cpf, false).subscribe({
      next: (response) => {
        this.carregando = false;
        if (response) {
          this.router.navigate(["/resultado"], {
            state: { dados: response, cpf: cpf }
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
}
