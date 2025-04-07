import {AfterViewInit, Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-compra-pack',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './compra-pack.component.html',
  styleUrl: './compra-pack.component.scss'
})
export class CompraPackComponent implements AfterViewInit{

  cupom!: string;
  usageCount!: number;


  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.cupom = navigation.extras.state['cupom'];
      this.usageCount = navigation.extras.state['limite'];
    }
  }

  ngAfterViewInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  copyCoupon(): void {
    const couponInput = document.getElementById('couponCode') as HTMLInputElement;
    couponInput.select();
    couponInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert(`Cupom copiado: ${this.cupom}`);
  }

}
