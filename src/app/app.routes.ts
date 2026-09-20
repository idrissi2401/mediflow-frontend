import { Routes } from '@angular/router';

import { Login } from './pages/login/login';

import { PlanningMedecin } from './pages/planning-medecin/planning-medecin';

import { PlanningAccueil } from './pages/planning-accueil/planning-accueil';

import { Consultation } from './pages/consultation/consultation';

import { Patients } from './pages/patients/patients';

import { DossierPatient } from './pages/dossier-patient/dossier-patient';

import { PatientsAccueil } from './pages/patients-accueil/patients-accueil';

import { DossierPatientAccueil } from './pages/dossier-patient-accueil/dossier-patient-accueil';

import { Administration } from './pages/administration/administration';


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
    path: 'planning-accueil',
    component: PlanningAccueil
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
  },

  {
    path: 'patients-accueil',
    component: PatientsAccueil
  },

  {
    path: 'patients-accueil/:id',
    component: DossierPatientAccueil
  },

  {
    path: 'administration',
    component: Administration
  }

];