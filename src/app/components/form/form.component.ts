import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  forms = new FormGroup({
    cpf: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required])
  })

  onSubmit() {
    console.warn(this.forms.value);
  }


}
