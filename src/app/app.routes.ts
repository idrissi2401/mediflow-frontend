import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { PlanningMedecin } from './pages/planning-medecin/planning-medecin';
import { Consultation } from './pages/consultation/consultation';
import { Patients } from './pages/patients/patients';
import { DossierPatient } from './pages/dossier-patient/dossier-patient';

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
  },

  {
    path: 'patients',
    component: Patients
  },

  {
    path: 'patients/:id',
    component: DossierPatient
  }

];