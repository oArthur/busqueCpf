import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-form-resultado',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './form-resultado.component.html',
  styleUrl: './form-resultado.component.scss'
})
export class FormResultadoComponent {

  @Input() titulo: string = "RELATÓRIO PARCIAL"; // Título do relatório
  @Input() dados: any[] = []; // Array de objetos com os dados a serem exibidos
  @Input() mostrarBotao: boolean = true; // Controla se o botão deve ser mostrado
  @Input() textoBotao: string = "🔒 Liberar Relatório Completo";
  scrollParaCompra() {
    const elemento = document.getElementById('compra');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


}
