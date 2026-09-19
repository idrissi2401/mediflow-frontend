import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
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
export class DossierPatientAccueil implements OnInit, OnDestroy {

  // =========================
  // PATIENT
  // =========================

  patientId: number = 0;

  patient: any = null;

  chargement = true;

  erreur = '';


  // =========================
  // RAFRAÎCHISSEMENT
  // =========================

  private intervalRafraichissement: any;


  // =========================
  // MODIFICATION
  // =========================

  modificationEnCours = false;

  enregistrementEnCours = false;

  erreurModification = '';

  succesModification = '';

  nom = '';

  prenom = '';

  dateNaissance = '';

  telephone = '';

  email = '';

  adresse = '';


  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    this.patientId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (!this.patientId) {

      this.erreur =
        'Patient introuvable.';

      this.chargement =
        false;

      return;
    }


    // Premier chargement

    this.chargerPatient();


    // Actualisation automatique
    // toutes les 5 secondes

    this.intervalRafraichissement =
      setInterval(() => {

        this.actualiserPatient();

      }, 5000);
  }


  // =========================
  // ARRÊTER LE RAFRAÎCHISSEMENT
  // =========================

  ngOnDestroy(): void {

    if (this.intervalRafraichissement) {

      clearInterval(
        this.intervalRafraichissement
      );

    }
  }


  // =========================
  // CHARGER LE PATIENT
  // =========================

  chargerPatient(): void {

    this.patientService
      .getPatientById(
        this.patientId
      )
      .subscribe({

        next: (data) => {

          this.patient =
            data;

          this.chargement =
            false;

          this.cdr.detectChanges();

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

          this.cdr.detectChanges();

        }

      });
  }


  // =========================
  // ACTUALISER LE PATIENT
  // =========================

  actualiserPatient(): void {

    this.patientService
      .getPatientById(
        this.patientId
      )
      .subscribe({

        next: (data) => {

          this.patient =
            data;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur actualisation patient :',
            error
          );

        }

      });
  }


  // =========================
  // COMMENCER LA MODIFICATION
  // =========================

  modifierPatient(): void {

    if (!this.patient) {
      return;
    }

    this.nom =
      this.patient.nom || '';

    this.prenom =
      this.patient.prenom || '';

    this.dateNaissance =
      this.patient.dateNaissance || '';

    this.telephone =
      this.patient.telephone || '';

    this.email =
      this.patient.email || '';

    this.adresse =
      this.patient.adresse || '';

    this.erreurModification = '';

    this.succesModification = '';

    this.modificationEnCours =
      true;
  }


  // =========================
  // ANNULER LA MODIFICATION
  // =========================

  annulerModification(): void {

    this.modificationEnCours =
      false;

    this.erreurModification =
      '';
  }


  // =========================
  // ENREGISTRER
  // =========================

  enregistrerModification(): void {

    this.erreurModification = '';

    this.succesModification = '';


    // =========================
    // NOM
    // =========================

    if (
      this.nom.trim() === ''
    ) {

      this.erreurModification =
        'Veuillez renseigner le nom.';

      return;
    }


    // =========================
    // PRÉNOM
    // =========================

    if (
      this.prenom.trim() === ''
    ) {

      this.erreurModification =
        'Veuillez renseigner le prénom.';

      return;
    }


    // =========================
    // DATE DE NAISSANCE
    // =========================

    if (
      this.dateNaissance === ''
    ) {

      this.erreurModification =
        'Veuillez renseigner la date de naissance.';

      return;
    }

    const dateNaissancePatient =
      new Date(
        this.dateNaissance + 'T00:00:00'
      );

    const aujourdHui =
      new Date();

    aujourdHui.setHours(
      0,
      0,
      0,
      0
    );

    if (
      dateNaissancePatient >
      aujourdHui
    ) {

      this.erreurModification =
        'La date de naissance ne peut pas être dans le futur.';

      return;
    }


    // =========================
    // TÉLÉPHONE
    // =========================

    const telephoneNettoye =
      this.telephone
        .trim()
        .replace(
          /[\s.-]/g,
          ''
        );

    if (
      telephoneNettoye !== ''
    ) {

      const telephoneValide =
        /^(?:\+33|0)[1-9]\d{8}$/;

      if (
        !telephoneValide.test(
          telephoneNettoye
        )
      ) {

        this.erreurModification =
          'Le numéro de téléphone est invalide. Exemple : 0612345678.';

        return;
      }
    }


    // =========================
    // EMAIL
    // =========================

    const emailNettoye =
      this.email
        .trim()
        .toLowerCase();

    if (
      emailNettoye !== ''
    ) {

      const emailValide =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailValide.test(
          emailNettoye
        )
      ) {

        this.erreurModification =
          'L\'adresse email est invalide.';

        return;
      }
    }


    // =========================
    // PATIENT MODIFIÉ
    // =========================

    const patientModifie = {

      ...this.patient,

      nom:
        this.nom.trim(),

      prenom:
        this.prenom.trim(),

      dateNaissance:
        this.dateNaissance,

      telephone:
        telephoneNettoye,

      email:
        emailNettoye,

      adresse:
        this.adresse.trim()

    };


    // =========================
    // APPEL API
    // =========================

    this.enregistrementEnCours =
      true;

    this.patientService
      .modifierPatient(
        this.patient.id,
        patientModifie
      )
      .subscribe({

        next: (data) => {

          this.patient =
            data;

          this.enregistrementEnCours =
            false;

          this.modificationEnCours =
            false;

          this.succesModification =
            'Les informations du patient ont été modifiées.';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur modification patient :',
            error
          );

          this.enregistrementEnCours =
            false;

          if (
            typeof error.error ===
            'string'
          ) {

            this.erreurModification =
              error.error;

          } else {

            this.erreurModification =
              'Impossible de modifier le patient.';

          }

          this.cdr.detectChanges();

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