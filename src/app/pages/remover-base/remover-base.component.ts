import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfService } from '../../services/cpf.service';
import {FormatCpfService} from '../../services/format-cpf.service';

@Component({
  selector: 'app-remover-base',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgxMaskDirective
  ],
  templateUrl: './remover-base.component.html',
  styleUrl: './remover-base.component.scss'
})
export class RemoverBaseComponent implements OnInit {
  formRemocao!: FormGroup;
  enviado: boolean = false;
  cpfInvalido: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cpfService: FormatCpfService
  ) {}

  ngOnInit(): void {
    this.formRemocao = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmacaoTitular: [false, Validators.requiredTrue],
      confirmacaoExclusao: [false, Validators.requiredTrue]
    });
  }

  validarCpf(): void {
    const cpf = this.formRemocao.get('cpf')?.value;
    if (cpf && !this.cpfService.validarCpf(cpf)) {
      this.cpfInvalido = true;
      this.formRemocao.get('cpf')?.setErrors({ invalidCpf: true });
    } else {
      this.cpfInvalido = false;
      this.formRemocao.get('cpf')?.setErrors(null);
    }
  }


  onSubmit(): void {
    if (this.formRemocao.valid && !this.cpfInvalido) {
      const url = 'https://jarvis-app.referencia.company/webhook/descadastrar-cpf';

      this.http.post(url, this.formRemocao.value).subscribe({
        next: (res) => {
          console.log('Solicitação enviada com sucesso:', res);
          this.enviado = true;
        },
        error: (err) => {
          console.error('Erro ao enviar solicitação:', err);
        }
      });
    }
  }
}
