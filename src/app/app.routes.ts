import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {PoliticasPrivacidadeComponent} from './pages/politicas-privacidade/politicas-privacidade.component';
import {ResultadoParcialComponent} from './pages/resultado-parcial/resultado-parcial.component';
import {PagamentoComponent} from './pages/pagamento/pagamento.component';
import {ResultadoCompletoComponent} from './pages/resultado-completo/resultado-completo.component';
import {RemoverBaseComponent} from './pages/remover-base/remover-base.component';

export const routes: Routes = [
  {path: '', title: 'Home - Busque CPF', loadComponent: () => import("../app/pages/home/home.component").then(c=>c.HomeComponent)},
  {path: 'politicas-de-privacidade', title: "Politicas - Busque CPF", loadComponent: () => import("../app/pages/politicas-privacidade/politicas-privacidade.component").then(c=>c.PoliticasPrivacidadeComponent)},
  {path: 'resultado', title: "Resultado Parcial - Busque CPF", loadComponent: () => import("../app/pages/resultado-parcial/resultado-parcial.component").then(c=>c.ResultadoParcialComponent)},
  {path: 'resultado-completo/:id', title: "Resultado Completo - Busque CPF", loadComponent: () => import("../app/pages/resultado-completo/resultado-completo.component").then(c=>c.ResultadoCompletoComponent)},
  {path: 'pagamento', title: "Pagamento - Busque CPF", loadComponent: () => import("../app/pages/pagamento/pagamento.component").then(c=>c.PagamentoComponent)},
  {path: 'obrigado-pacote', title: "Compra Pacote - Busque CPF", loadComponent: () => import("../app/pages/compra-pack/compra-pack.component").then(c=>c.CompraPackComponent)},
  {path: 'descadastrar', title: "Descadastrar CPF - Busque CPF", loadComponent: () => import("../app/pages/remover-base/remover-base.component").then(c=>c.RemoverBaseComponent)},
];
