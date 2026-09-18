import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  PatientService
} from '../../services/patient';

@Component({
  selector: 'app-dossier-patient-accueil',
  imports: [
    RouterLink
  ],
  templateUrl: './dossier-patient-accueil.html',
  styleUrl: './dossier-patient-accueil.css',
})
export class DossierPatientAccueil implements OnInit {

  patient: any = null;

  chargement = true;
  erreur = '';


  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) { }


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (!id) {

      this.erreur =
        'Patient introuvable.';

      this.chargement =
        false;

      return;

    }

    this.chargerPatient(id);

  }


  // =========================
  // CHARGER LE PATIENT
  // =========================

  chargerPatient(
    id: number
  ): void {

    this.patientService
      .getPatientById(id)
      .subscribe({

        next: (data) => {

          this.patient =
            data;

          this.chargement =
            false;

        },

        error: (error) => {

          console.error(
            'Erreur récupération patient :',
            error
          );

          this.erreur =
            'Impossible de charger le dossier du patient.';

          this.chargement =
            false;

        }

      });

  }


  // =========================
  // DÉCONNEXION
  // =========================

  deconnexion(): void {

    localStorage.removeItem(
      'token'
    );

    this.router.navigate([
      '/login'
    ]);

  }

}