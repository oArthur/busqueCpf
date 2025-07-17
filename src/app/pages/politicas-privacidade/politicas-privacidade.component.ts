import {AfterViewInit, Component, HostListener} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {filter} from 'rxjs';

@Component({
  selector: 'app-politicas-privacidade',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './politicas-privacidade.component.html',
  styleUrl: './politicas-privacidade.component.scss'
})
export class PoliticasPrivacidadeComponent {

  showBackToTop = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    // Escuta eventos de navegação
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0);
        }
      });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.showBackToTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
