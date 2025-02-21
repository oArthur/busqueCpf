import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-remover-base',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './remover-base.component.html',
  styleUrl: './remover-base.component.scss'
})
export class RemoverBaseComponent implements OnInit {
  formRemocao!: FormGroup;
  enviado: boolean = false; // Para controlar estado de envio (exemplo)

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.formRemocao = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmacaoTitular: [false, Validators.requiredTrue],
      confirmacaoExclusao: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.formRemocao.valid) {
      // Substitua pela URL da sua API
      const url = 'https://jarvis-app.referencia.company/webhook/descadastrar-cpf';

      this.http.post(url, this.formRemocao.value).subscribe({
        next: (res) => {
          console.log('Solicitação enviada com sucesso:', res);
          this.enviado = true;
          // Aqui você pode exibir uma mensagem de sucesso ou redirecionar
        },
        error: (err) => {
          console.error('Erro ao enviar solicitação:', err);
          // Tratar erros de forma apropriada
        }
      });
    }
  }
}
