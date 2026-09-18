import {
  Component,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { RendezVous } from '../../services/rendez-vous';
import { PatientService } from '../../services/patient';
import { UtilisateurService } from '../../services/utilisateur';

@Component({
  selector: 'app-planning-accueil',
  imports: [
    RouterLink
  ],
  templateUrl: './planning-accueil.html',
  styleUrl: './planning-accueil.css',
})
export class PlanningAccueil implements OnInit, OnDestroy {

  // =========================
  // DONNÉES
  // =========================

  rendezVous = signal<any[]>([]);
  patients = signal<any[]>([]);
  medecins = signal<any[]>([]);
  accueils = signal<any[]>([]);

  joursSemaine: Date[] = [];
  semainesDisponibles: Date[] = [];

  personnelSelectionne: string = 'TOUS';

  private intervalRafraichissement: any;


  // =========================
  // POPUP
  // =========================

  popupNouveauRendezVous = false;

  dateSelectionnee = '';
  heureSelectionnee = '';
  dateHeureSelectionnee = '';

  typeRendezVous = 'MEDICAL';

  patientSelectionne: number | null = null;
  medecinSelectionne: number | null = null;
  accueilSelectionne: number | null = null;

  motif = '';

  erreurCreation = '';
  creationEnCours = false;


  constructor(
    private rendezVousService: RendezVous,
    private patientService: PatientService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) { }


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    this.genererSemaine();
    this.genererSemainesDisponibles();

    this.chargerRendezVous();
    this.chargerPatients();
    this.chargerUtilisateurs();

    // Actualisation automatique
    // toutes les 5 secondes
    this.intervalRafraichissement =
      setInterval(() => {

        this.chargerRendezVous();

      }, 5000);

  }


  // =========================
  // ARRÊT DU RAFRAÎCHISSEMENT
  // =========================

  ngOnDestroy(): void {

    if (this.intervalRafraichissement) {

      clearInterval(
        this.intervalRafraichissement
      );

    }

  }


  // =========================
  // CHARGEMENT DES DONNÉES
  // =========================

  chargerRendezVous(): void {

    this.rendezVousService
      .getRendezVous()
      .subscribe({

        next: (data) => {

          this.rendezVous.set(data);

        },

        error: (error) => {

          console.log(
            'Erreur récupération rendez-vous :',
            error
          );

        }

      });

  }


  chargerPatients(): void {

    this.patientService
      .getAllPatients()
      .subscribe({

        next: (data) => {

          this.patients.set(data);

        },

        error: (error) => {

          console.log(
            'Erreur récupération patients :',
            error
          );

        }

      });

  }


  chargerUtilisateurs(): void {

    this.utilisateurService
      .getAllUtilisateurs()
      .subscribe({

        next: (data) => {

          const medecins =
            data.filter(
              utilisateur =>
                utilisateur.role === 'MEDECIN' &&
                utilisateur.actif === true
            );

          const accueils =
            data.filter(
              utilisateur =>
                utilisateur.role === 'ACCUEIL' &&
                utilisateur.actif === true
            );

          this.medecins.set(
            medecins
          );

          this.accueils.set(
            accueils
          );

        },

        error: (error) => {

          console.log(
            'Erreur récupération utilisateurs :',
            error
          );

        }

      });

  }


  // =========================
  // DATES
  // =========================

  genererSemaine(): void {

    const aujourdHui =
      new Date();

    const jour =
      aujourdHui.getDay();

    const differenceLundi =
      aujourdHui.getDate() -
      jour +
      (jour === 0 ? -6 : 1);

    const lundi =
      new Date(aujourdHui);

    lundi.setDate(
      differenceLundi
    );

    this.joursSemaine = [];

    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const date =
        new Date(lundi);

      date.setDate(
        lundi.getDate() + i
      );

      this.joursSemaine.push(
        date
      );

    }

  }


  formatDate(
    date: Date
  ): string {

    if (!date) {
      return '';
    }

    return date.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit'
      }
    );

  }


  formatDateComparaison(
    date: Date
  ): string {

    const annee =
      date.getFullYear();

    const mois =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const jour =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${annee}-${mois}-${jour}`;

  }


  // =========================
  // SÉLECTION DU PERSONNEL
  // =========================

  selectionnerPersonnel(
    valeur: string
  ): void {

    this.personnelSelectionne =
      valeur;

  }


  // =========================
  // FILTRER LES RENDEZ-VOUS
  // SELON LE PERSONNEL
  // =========================

  getRendezVousFiltres(): any[] {

    if (
      this.personnelSelectionne ===
      'TOUS'
    ) {

      return this.rendezVous();

    }

    const [
      type,
      id
    ] =
      this.personnelSelectionne
        .split('-');

    const utilisateurId =
      Number(id);


    if (
      type === 'MEDECIN'
    ) {

      return this.rendezVous()
        .filter(
          rdv =>
            rdv.medecin &&
            rdv.medecin.id ===
            utilisateurId
        );

    }


    if (
      type === 'ACCUEIL'
    ) {

      return this.rendezVous()
        .filter(
          rdv =>
            rdv.accueil &&
            rdv.accueil.id ===
            utilisateurId
        );

    }


    return this.rendezVous();

  }


  // =========================
  // RENDEZ-VOUS D'UN CRÉNEAU
  // =========================

  getRendezVousCreneau(
    date: Date,
    heure: number,
    minute: number
  ): any[] {

    const datePlanning =
      this.formatDateComparaison(
        date
      );

    return this
      .getRendezVousFiltres()
      .filter(rdv => {

        if (
          rdv.annule === true
        ) {

          return false;

        }

        const dateRdv =
          rdv.dateHeure.substring(
            0,
            10
          );

        const heureRdv =
          Number(
            rdv.dateHeure.substring(
              11,
              13
            )
          );

        const minuteRdv =
          Number(
            rdv.dateHeure.substring(
              14,
              16
            )
          );

        return (
          dateRdv === datePlanning &&
          heureRdv === heure &&
          minuteRdv === minute
        );

      });

  }


  // =========================
  // MÉDECINS DISPONIBLES
  // =========================

  getMedecinsDisponibles(
    date: Date,
    heure: number,
    minute: number
  ): any[] {

    const rdvs =
      this.getRendezVousCreneau(
        date,
        heure,
        minute
      );

    const medecinsOccupes =
      new Set(
        rdvs
          .filter(
            rdv => rdv.medecin
          )
          .map(
            rdv => rdv.medecin.id
          )
      );

    return this.medecins()
      .filter(
        medecin =>
          !medecinsOccupes.has(
            medecin.id
          )
      );

  }


  // =========================
  // ACCUEILS DISPONIBLES
  // =========================

  getAccueilsDisponibles(
    date: Date,
    heure: number,
    minute: number
  ): any[] {

    const rdvs =
      this.getRendezVousCreneau(
        date,
        heure,
        minute
      );

    const accueilsOccupes =
      new Set(
        rdvs
          .filter(
            rdv => rdv.accueil
          )
          .map(
            rdv => rdv.accueil.id
          )
      );

    return this.accueils()
      .filter(
        accueil =>
          !accueilsOccupes.has(
            accueil.id
          )
      );

  }


  // =========================
  // DISPONIBILITÉS
  // =========================

  medecinDisponible(
    date: Date,
    heure: number,
    minute: number
  ): boolean {

    return (
      this.getMedecinsDisponibles(
        date,
        heure,
        minute
      ).length > 0
    );

  }


  accueilDisponible(
    date: Date,
    heure: number,
    minute: number
  ): boolean {

    return (
      this.getAccueilsDisponibles(
        date,
        heure,
        minute
      ).length > 0
    );

  }


  // =========================
  // COULEUR DU CRÉNEAU
  // =========================

  classeCreneau(
    date: Date,
    heure: number,
    minute: number
  ): string {

    const medecinDisponible =
      this.medecinDisponible(
        date,
        heure,
        minute
      );

    const accueilDisponible =
      this.accueilDisponible(
        date,
        heure,
        minute
      );


    // Médecin + accueil disponibles
    if (
      medecinDisponible &&
      accueilDisponible
    ) {

      return 'disponible-complet';

    }


    // Médecin uniquement
    if (
      medecinDisponible &&
      !accueilDisponible
    ) {

      return 'medecin-disponible';

    }


    // Accueil uniquement
    if (
      !medecinDisponible &&
      accueilDisponible
    ) {

      return 'accueil-disponible';

    }


    // Personne disponible
    return 'indisponible';

  }


  // =========================
  // OUVRIR UN CRÉNEAU
  // =========================

  ouvrirCreneau(
    date: Date,
    heure: number,
    minute: number
  ): void {

    const dateFormatee =
      this.formatDateComparaison(
        date
      );

    const heureFormatee =
      String(heure)
        .padStart(2, '0');

    const minuteFormatee =
      String(minute)
        .padStart(2, '0');


    this.dateSelectionnee =
      date.toLocaleDateString(
        'fr-FR'
      );

    this.heureSelectionnee =
      `${heureFormatee}:${minuteFormatee}`;

    this.dateHeureSelectionnee =
      `${dateFormatee}T${heureFormatee}:${minuteFormatee}:00`;


    this.reinitialiserFormulaire();

    this.popupNouveauRendezVous =
      true;

  }


  // =========================
  // RDV DU CRÉNEAU OUVERT
  // =========================

  getRendezVousCreneauSelectionne():
    any[] {

    if (
      !this.dateHeureSelectionnee
    ) {

      return [];

    }

    return this
      .getRendezVousFiltres()
      .filter(rdv => {

        return (
          rdv.annule === false &&
          rdv.dateHeure ===
          this.dateHeureSelectionnee
        );

      });

  }


  // =========================
  // MÉDECINS DISPONIBLES
  // POUR LE CRÉNEAU OUVERT
  // =========================

  getMedecinsDisponiblesSelectionnes():
    any[] {

    const rdvs =
      this
        .getRendezVousCreneauSelectionne();

    const idsOccupes =
      new Set(
        rdvs
          .filter(
            rdv => rdv.medecin
          )
          .map(
            rdv => rdv.medecin.id
          )
      );

    return this.medecins()
      .filter(
        medecin =>
          !idsOccupes.has(
            medecin.id
          )
      );

  }


  // =========================
  // ACCUEILS DISPONIBLES
  // POUR LE CRÉNEAU OUVERT
  // =========================

  getAccueilsDisponiblesSelectionnes():
    any[] {

    const rdvs =
      this
        .getRendezVousCreneauSelectionne();

    const idsOccupes =
      new Set(
        rdvs
          .filter(
            rdv => rdv.accueil
          )
          .map(
            rdv => rdv.accueil.id
          )
      );

    return this.accueils()
      .filter(
        accueil =>
          !idsOccupes.has(
            accueil.id
          )
      );

  }


  // =========================
  // CHANGER TYPE
  // =========================

  changerTypeRendezVous(
    type: string
  ): void {

    this.typeRendezVous =
      type;

    this.medecinSelectionne =
      null;

    this.accueilSelectionne =
      null;

    this.erreurCreation =
      '';

  }


  // =========================
  // CRÉER RENDEZ-VOUS
  // =========================

  creerRendezVous(): void {

    this.erreurCreation = '';


    if (
      this.patientSelectionne ===
      null
    ) {

      this.erreurCreation =
        'Veuillez sélectionner un patient.';

      return;

    }


    if (
      this.motif.trim() === ''
    ) {

      this.erreurCreation =
        'Veuillez renseigner le motif.';

      return;

    }


    // =========================
    // MÉDICAL
    // =========================

    if (
      this.typeRendezVous ===
      'MEDICAL'
    ) {

      if (
        this.medecinSelectionne ===
        null
      ) {

        this.erreurCreation =
          'Veuillez sélectionner un médecin disponible.';

        return;

      }

    }


    // =========================
    // ADMINISTRATIF
    // =========================

    if (
      this.typeRendezVous ===
      'ADMINISTRATIF'
    ) {

      if (
        this.accueilSelectionne ===
        null
      ) {

        this.erreurCreation =
          'Veuillez sélectionner une personne à l’accueil disponible.';

        return;

      }

    }


    const nouveauRendezVous: any = {

      dateHeure:
        this.dateHeureSelectionnee,

      motif:
        this.motif.trim(),

      annule:
        false,

      patient: {
        id: this.patientSelectionne
      },

      medecin:
        null,

      accueil:
        null

    };


    if (
      this.typeRendezVous ===
      'MEDICAL'
    ) {

      nouveauRendezVous.medecin = {
        id: this.medecinSelectionne
      };

    }


    if (
      this.typeRendezVous ===
      'ADMINISTRATIF'
    ) {

      nouveauRendezVous.accueil = {
        id: this.accueilSelectionne
      };

    }


    this.creationEnCours =
      true;

    console.log(
      'RDV envoyé :',
      nouveauRendezVous
    );

    this.rendezVousService
      .creerRendezVous(
        nouveauRendezVous
      )
      .subscribe({

        next: () => {

          this.creationEnCours =
            false;

          this.fermerPopup();

          this.chargerRendezVous();

        },

        error: (error) => {

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
              'Impossible de créer le rendez-vous.';

          }

          console.log(
            'Erreur création rendez-vous :',
            error
          );

        }

      });

  }


  // =========================
  // ANNULER UN RENDEZ-VOUS
  // =========================

  annulerRendezVous(
    rdv: any
  ): void {

    const rendezVousAnnule = {
      ...rdv,
      annule: true
    };

    this.rendezVousService
      .modifierRendezVous(
        rdv.id,
        rendezVousAnnule
      )
      .subscribe({

        next: () => {

          this.chargerRendezVous();

        },

        error: (error) => {

          console.error(
            'Erreur lors de l\'annulation du rendez-vous :',
            error
          );

        }

      });

  }


  // =========================
  // FORMULAIRE
  // =========================

  reinitialiserFormulaire(): void {

    this.typeRendezVous =
      'MEDICAL';

    this.patientSelectionne =
      null;

    this.medecinSelectionne =
      null;

    this.accueilSelectionne =
      null;

    this.motif =
      '';

    this.erreurCreation =
      '';

    this.creationEnCours =
      false;

  }


  fermerPopup(): void {

    this.popupNouveauRendezVous =
      false;

    this.dateSelectionnee =
      '';

    this.heureSelectionnee =
      '';

    this.dateHeureSelectionnee =
      '';

    this.reinitialiserFormulaire();

  }


  // =========================
  // NAVIGATION SEMAINE
  // =========================

  semainePrecedente(): void {

    this.joursSemaine =
      this.joursSemaine.map(
        date => {

          const nouvelleDate =
            new Date(date);

          nouvelleDate.setDate(
            nouvelleDate.getDate() - 7
          );

          return nouvelleDate;

        }
      );

  }


  semaineSuivante(): void {

    this.joursSemaine =
      this.joursSemaine.map(
        date => {

          const nouvelleDate =
            new Date(date);

          nouvelleDate.setDate(
            nouvelleDate.getDate() + 7
          );

          return nouvelleDate;

        }
      );

  }


  aujourdhui(): void {

    this.genererSemaine();

  }


  genererSemainesDisponibles(): void {

    const aujourdHui =
      new Date();

    const jour =
      aujourdHui.getDay();

    const differenceLundi =
      aujourdHui.getDate() -
      jour +
      (jour === 0 ? -6 : 1);

    const lundiActuel =
      new Date(aujourdHui);

    lundiActuel.setDate(
      differenceLundi
    );

    this.semainesDisponibles = [];

    for (
      let i = -4;
      i <= 4;
      i++
    ) {

      const lundi =
        new Date(lundiActuel);

      lundi.setDate(
        lundiActuel.getDate() +
        (i * 7)
      );

      this.semainesDisponibles.push(
        lundi
      );

    }

  }


  formatSemaine(
    lundi: Date
  ): string {

    const dimanche =
      new Date(lundi);

    dimanche.setDate(
      lundi.getDate() + 6
    );

    return (
      this.formatDate(lundi) +
      ' – ' +
      this.formatDate(dimanche)
    );

  }


  selectionnerSemaine(
    valeur: string
  ): void {

    const lundi =
      new Date(
        valeur + 'T00:00:00'
      );

    this.joursSemaine = [];

    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const date =
        new Date(lundi);

      date.setDate(
        lundi.getDate() + i
      );

      this.joursSemaine.push(
        date
      );

    }

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