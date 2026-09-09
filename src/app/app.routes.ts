import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { PlanningMedecin } from './pages/planning-medecin/planning-medecin';
import { Consultation } from './pages/consultation/consultation';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'planning-medecin',
    component: PlanningMedecin
  },
  {
    path: 'consultation/:id',
    component: Consultation
  }
];