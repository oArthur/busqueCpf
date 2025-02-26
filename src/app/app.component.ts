import { Component, LOCALE_ID } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';


registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
})
export class AppComponent {

  constructor(private router: Router) {
  }
  irParaHome() {
    this.router.navigate(['/']); // Redireciona para a página inicial
  }
}
