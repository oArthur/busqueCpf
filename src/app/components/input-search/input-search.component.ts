import {Component, Input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss'
})
export class InputSearchComponent {

  @Input() title: string = ''

  buscaPrincipal = new FormControl('', [Validators.required])

  onSubmit(event: Event) {
    event.preventDefault()
    console.warn(this.buscaPrincipal.value);
  }
}
