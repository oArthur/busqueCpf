import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {PoliticasPrivacidadeComponent} from './pages/politicas-privacidade/politicas-privacidade.component';

export const routes: Routes = [
  {path: '', title: 'Home - Buscar Pessoa', component: HomeComponent},
  {path: 'politicas-de-privacidade', title: "Politicas - Buscar Pessoa", component: PoliticasPrivacidadeComponent}
];
