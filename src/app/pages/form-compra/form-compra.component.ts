import {Component, Input} from '@angular/core';
import {FormContatoComponent} from '../../components/form-contato/form-contato.component';

@Component({
  selector: 'app-form-compra',
  standalone: true,
  imports: [
    FormContatoComponent
  ],
  templateUrl: './form-compra.component.html',
  styleUrl: './form-compra.component.scss'
})
export class FormCompraComponent {

  @Input() cpf!: string;

}
