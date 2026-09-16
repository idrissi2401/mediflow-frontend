import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RendezVous } from '../../services/rendez-vous';

@Component({
  selector: 'app-planning-medecin',
  imports: [
    RouterLink
  ],
  templateUrl: './planning-medecin.html',
  styleUrl: './planning-medecin.css',
})
export class PlanningMedecin implements OnInit {

  rendezVous = signal<any[]>([]);

  joursSemaine: Date[] = [];
  semainesDisponibles: Date[] = [];

  constructor(
    private rendezVousService: RendezVous,
    private router: Router
  ) { }


  ngOnInit(): void {

    this.genererSemaine();
    this.genererSemainesDisponibles();

    this.rendezVousService
      .getRendezVous()
      .subscribe({

        next: (data) => {

          this.rendezVous.set(data);

          console.log(
            'Rendez-vous récupérés :',
            data
          );

        },

        error: (error) => {

          console.log(
            'Erreur récupération rendez-vous :',
            error
          );

        }

      });

  }


  // =========================
  // GÉNÉRER LA SEMAINE
  // =========================

  genererSemaine(): void {

    const aujourdHui = new Date();

    const jour = aujourdHui.getDay();

    const differenceLundi =
      aujourdHui.getDate() -
      jour +
      (jour === 0 ? -6 : 1);

    const lundi = new Date(aujourdHui);

    lundi.setDate(differenceLundi);

    this.joursSemaine = [];

    for (let i = 0; i < 7; i++) {

      const date = new Date(lundi);

      date.setDate(
        lundi.getDate() + i
      );

      this.joursSemaine.push(date);

    }

  }


  // =========================
  // FORMAT DATE
  // =========================

  formatDate(date: Date): string {

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


  // =========================
  // FORMAT COMPARAISON
  // =========================

  formatDateComparaison(date: Date): string {

    const annee = date.getFullYear();

    const mois = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const jour = String(
      date.getDate()
    ).padStart(2, '0');

    return `${annee}-${mois}-${jour}`;

  }


  // =========================
  // VÉRIFIER RENDEZ-VOUS
  // =========================

  aRendezVous(
    date: Date,
    heure: number
  ): boolean {

    if (!date) {
      return false;
    }

    const datePlanning =
      this.formatDateComparaison(date);

    return this.rendezVous().some(rdv => {

      if (rdv.annule === true) {
        return false;
      }

      const dateRdv =
        rdv.dateHeure.substring(0, 10);

      const heureRdv =
        Number(
          rdv.dateHeure.substring(11, 13)
        );

      return (
        dateRdv === datePlanning &&
        heureRdv === heure
      );

    });

  }


  // =========================
  // OUVRIR RENDEZ-VOUS
  // =========================

  ouvrirRendezVous(
    date: Date,
    heure: number
  ): void {

    if (!date) {
      return;
    }

    const datePlanning =
      this.formatDateComparaison(date);

    const rdv =
      this.rendezVous().find(rdv => {

        if (rdv.annule === true) {
          return false;
        }

        const dateRdv =
          rdv.dateHeure.substring(0, 10);

        const heureRdv =
          Number(
            rdv.dateHeure.substring(11, 13)
          );

        return (
          dateRdv === datePlanning &&
          heureRdv === heure
        );

      });


    if (rdv) {

      this.router.navigate([
        '/consultation',
        rdv.id
      ]);

    }

  }


  // =========================
  // SEMAINE PRÉCÉDENTE
  // =========================

  semainePrecedente(): void {

    this.joursSemaine =
      this.joursSemaine.map(date => {

        const nouvelleDate =
          new Date(date);

        nouvelleDate.setDate(
          nouvelleDate.getDate() - 7
        );

        return nouvelleDate;

      });

  }


  // =========================
  // SEMAINE SUIVANTE
  // =========================

  semaineSuivante(): void {

    this.joursSemaine =
      this.joursSemaine.map(date => {

        const nouvelleDate =
          new Date(date);

        nouvelleDate.setDate(
          nouvelleDate.getDate() + 7
        );

        return nouvelleDate;

      });

  }

  // =========================
  // GÉNÉRER LISTE DES SEMAINES
  // =========================

  genererSemainesDisponibles(): void {

    const aujourdHui = new Date();

    const jour = aujourdHui.getDay();

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

    // 4 semaines avant
    // + semaine actuelle
    // + 4 semaines après

    for (let i = -4; i <= 4; i++) {

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


  // =========================
  // AFFICHER UNE SEMAINE
  // DANS LA LISTE
  // =========================

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


  // =========================
  // SÉLECTIONNER UNE SEMAINE
  // =========================

  selectionnerSemaine(
    valeur: string
  ): void {

    const lundi =
      new Date(valeur + 'T00:00:00');

    this.joursSemaine = [];

    for (let i = 0; i < 7; i++) {

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

  deconnexion(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);
  }

  afficherPeriode(): string {

    if (this.joursSemaine.length === 0) {
      return '';
    }

    const premierJour =
      this.joursSemaine[0];

    const dernierJour =
      this.joursSemaine[
      this.joursSemaine.length - 1
      ];

    const debut =
      premierJour.toLocaleDateString(
        'fr-FR',
        {
          day: '2-digit',
          month: '2-digit'
        }
      );

    const fin =
      dernierJour.toLocaleDateString(
        'fr-FR',
        {
          day: '2-digit',
          month: '2-digit'
        }
      );

    return `${debut} – ${fin}`;
  }


  aujourdhui(): void {

    this.genererSemaine();

  }

}