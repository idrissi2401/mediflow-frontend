import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  jwtDecode
} from 'jwt-decode';


export const roleGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');


  // =========================
  // PAS DE TOKEN
  // =========================

  if (!token) {

    router.navigate(['/login']);

    return false;
  }


  try {

    // =========================
    // LECTURE DU JWT
    // =========================

    const decoded: any = jwtDecode(token);

    const roleUtilisateur = decoded.role;

    const roleAutorise = route.data['role'];


    // =========================
    // RÔLE AUTORISÉ
    // =========================

    if (roleUtilisateur === roleAutorise) {

      return true;
    }


    // =========================
    // MAUVAIS RÔLE
    // =========================

    if (roleUtilisateur === 'MEDECIN') {

      router.navigate(['/planning-medecin']);

      return false;
    }


    if (roleUtilisateur === 'ACCUEIL') {

      router.navigate(['/planning-accueil']);

      return false;
    }


    if (roleUtilisateur === 'ADMIN') {

      router.navigate(['/administration']);

      return false;
    }


    // =========================
    // RÔLE INCONNU
    // =========================

    router.navigate(['/login']);

    return false;


  } catch (error) {

    console.log(
      'Erreur lecture du token :',
      error
    );

    localStorage.removeItem('token');

    router.navigate(['/login']);

    return false;
  }

};