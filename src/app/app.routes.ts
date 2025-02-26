import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {PoliticasPrivacidadeComponent} from './pages/politicas-privacidade/politicas-privacidade.component';
import {ResultadoParcialComponent} from './pages/resultado-parcial/resultado-parcial.component';
import {PagamentoComponent} from './pages/pagamento/pagamento.component';
import {ResultadoCompletoComponent} from './pages/resultado-completo/resultado-completo.component';
import {RemoverBaseComponent} from './pages/remover-base/remover-base.component';

export const routes: Routes = [
  {path: '', title: 'Home - Busque CPF', component: HomeComponent},
  {path: 'politicas-de-privacidade', title: "Politicas - Busque CPF", component: PoliticasPrivacidadeComponent},
  {path: 'resultado', title: "Resultado Parcial - Busque CPF", component: ResultadoParcialComponent},
  {path: 'resultado-completo/:id', title: "Resultado Completo - Busque CPF", component: ResultadoCompletoComponent},
  {path: 'pagamento', title: "Pagamento - Busque CPF", component: PagamentoComponent},
  {path: 'descadastrar', title: "Descadastrar CPF - Busque CPF", component: RemoverBaseComponent}
];
