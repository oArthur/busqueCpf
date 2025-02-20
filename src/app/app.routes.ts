import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {PoliticasPrivacidadeComponent} from './pages/politicas-privacidade/politicas-privacidade.component';
import {ResultadoParcialComponent} from './pages/resultado-parcial/resultado-parcial.component';
import {PagamentoComponent} from './pages/pagamento/pagamento.component';
import {ResultadoCompletoComponent} from './pages/resultado-completo/resultado-completo.component';

export const routes: Routes = [
  {path: '', title: 'Home - Consulte CPF', component: HomeComponent},
  {path: 'politicas-de-privacidade', title: "Politicas - Consulte CPF", component: PoliticasPrivacidadeComponent},
  {path: 'resultado', title: "Resultado Parcial - Consulte CPF", component: ResultadoParcialComponent},
  {path: 'resultado/:id', title: "Resultado Completo - Consulte CPF", component: ResultadoCompletoComponent},
  {path: 'pagamento', title: "Pagamento - Consulte CPF", component: PagamentoComponent}
];
