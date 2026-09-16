import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { PatientService } from '../../services/patient';

@Component({
  selector: 'app-patients',
  imports: [RouterLink],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class Patients implements OnInit {

  patients: any[] = [];

  chargement: boolean = true;

  erreur: string = '';

  constructor(
    private patientService: PatientService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    this.chargerPatients();

  }


  // =========================
  // CHARGER LES PATIENTS
  // =========================

  chargerPatients(): void {

    this.chargement = true;
    this.erreur = '';

    this.patientService
      .getAllPatients()
      .subscribe({

        next: (data) => {

          this.patients = data;

          this.chargement = false;

          console.log(
            'Patients récupérés :',
            this.patients
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(
            'Erreur récupération patients :',
            error
          );

          this.erreur =
            'Impossible de récupérer les patients.';

          this.chargement = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // DÉCONNEXION
  // =========================

  deconnexion(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);

  }

}