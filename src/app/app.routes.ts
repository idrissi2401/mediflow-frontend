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

import { roleGuard } from './guards/role-guard';


export const routes: Routes = [

  // =========================
  // CONNEXION
  // =========================

  {
    path: 'login',
    component: Login
  },


  // =========================
  // MÉDECIN
  // =========================

  {
    path: 'planning-medecin',
    component: PlanningMedecin,
    canActivate: [roleGuard],
    data: {
      role: 'MEDECIN'
    }
  },

  {
    path: 'consultation/:id',
    component: Consultation,
    canActivate: [roleGuard],
    data: {
      role: 'MEDECIN'
    }
  },

  {
    path: 'patients',
    component: Patients,
    canActivate: [roleGuard],
    data: {
      role: 'MEDECIN'
    }
  },

  {
    path: 'patients/:id',
    component: DossierPatient,
    canActivate: [roleGuard],
    data: {
      role: 'MEDECIN'
    }
  },


  // =========================
  // ACCUEIL
  // =========================

  {
    path: 'planning-accueil',
    component: PlanningAccueil,
    canActivate: [roleGuard],
    data: {
      role: 'ACCUEIL'
    }
  },

  {
    path: 'patients-accueil',
    component: PatientsAccueil,
    canActivate: [roleGuard],
    data: {
      role: 'ACCUEIL'
    }
  },

  {
    path: 'patients-accueil/:id',
    component: DossierPatientAccueil,
    canActivate: [roleGuard],
    data: {
      role: 'ACCUEIL'
    }
  },


  // =========================
  // ADMINISTRATEUR
  // =========================

  {
    path: 'administration',
    component: Administration,
    canActivate: [roleGuard],
    data: {
      role: 'ADMIN'
    }
  }

];