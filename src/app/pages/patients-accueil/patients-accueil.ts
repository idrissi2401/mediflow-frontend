import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { PatientService } from '../../services/patient';

@Component({
  selector: 'app-patients-accueil',
  imports: [
    RouterLink
  ],
  templateUrl: './patients-accueil.html',
  styleUrl: './patients-accueil.css'
})
export class PatientsAccueil implements OnInit, OnDestroy {

  // =========================
  // PATIENTS
  // =========================

  patients: any[] = [];

  chargement: boolean = true;

  erreur: string = '';


  // =========================
  // RAFRAÎCHISSEMENT
  // =========================

  private intervalRafraichissement: any;


  // =========================
  // POPUP NOUVEAU PATIENT
  // =========================

  popupNouveauPatient: boolean = false;

  nom: string = '';

  prenom: string = '';

  dateNaissance: string = '';

  telephone: string = '';

  email: string = '';

  adresse: string = '';

  erreurCreation: string = '';

  creationEnCours: boolean = false;


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


    // Actualisation automatique
    // toutes les 5 secondes

    this.intervalRafraichissement =
      setInterval(() => {

        this.actualiserPatients();

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
  // ACTUALISER LES PATIENTS
  // =========================

  actualiserPatients(): void {

    this.patientService
      .getAllPatients()
      .subscribe({

        next: (data) => {

          this.patients = data;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(
            'Erreur actualisation patients :',
            error
          );

        }

      });
  }


  // =========================
  // OUVRIR LA POPUP
  // =========================

  ouvrirNouveauPatient(): void {

    this.reinitialiserFormulaire();

    this.popupNouveauPatient =
      true;
  }


  // =========================
  // FERMER LA POPUP
  // =========================

  fermerNouveauPatient(): void {

    this.popupNouveauPatient =
      false;

    this.reinitialiserFormulaire();
  }


  // =========================
  // CRÉER UN PATIENT
  // =========================

  creerPatient(): void {

    this.erreurCreation = '';


    // =========================
    // NOM
    // =========================

    if (
      this.nom.trim() === ''
    ) {

      this.erreurCreation =
        'Veuillez renseigner le nom.';

      return;
    }


    // =========================
    // PRÉNOM
    // =========================

    if (
      this.prenom.trim() === ''
    ) {

      this.erreurCreation =
        'Veuillez renseigner le prénom.';

      return;
    }


    // =========================
    // DATE DE NAISSANCE
    // =========================

    if (
      this.dateNaissance === ''
    ) {

      this.erreurCreation =
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

      this.erreurCreation =
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

        this.erreurCreation =
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

        this.erreurCreation =
          'L\'adresse email est invalide.';

        return;
      }
    }


    // =========================
    // CRÉATION DU PATIENT
    // =========================

    const nouveauPatient = {

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


    this.creationEnCours =
      true;


    this.patientService
      .creerPatient(
        nouveauPatient
      )
      .subscribe({

        next: () => {

          this.creationEnCours =
            false;

          this.fermerNouveauPatient();

          this.chargerPatients();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur création patient :',
            error
          );

          this.creationEnCours =
            false;

          if (
            typeof error.error ===
            'string'
          ) {

            this.erreurCreation =
              error.error;

          } else {

            this.erreurCreation =
              'Impossible de créer le patient.';

          }

          this.cdr.detectChanges();

        }

      });
  }


  // =========================
  // RÉINITIALISER FORMULAIRE
  // =========================

  reinitialiserFormulaire(): void {

    this.nom = '';

    this.prenom = '';

    this.dateNaissance = '';

    this.telephone = '';

    this.email = '';

    this.adresse = '';

    this.erreurCreation = '';

    this.creationEnCours =
      false;
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