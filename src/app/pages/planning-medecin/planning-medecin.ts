import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RendezVous } from '../../services/rendez-vous';
import { jwtDecode } from 'jwt-decode';

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


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    this.genererSemaine();
    this.genererSemainesDisponibles();

    this.rendezVousService
      .getRendezVous()
      .subscribe({

        next: (data) => {

          const token =
            localStorage.getItem('token');

          if (!token) {
            return;
          }

          const decodedToken: any =
            jwtDecode(token);

          const emailMedecinConnecte =
            decodedToken.sub;

          const rendezVousDuMedecin =
            data.filter(rdv =>
              rdv.medecin != null &&
              rdv.medecin.email === emailMedecinConnecte
            );

          this.rendezVous.set(
            rendezVousDuMedecin
          );

          console.log(
            'Rendez-vous du médecin connecté :',
            rendezVousDuMedecin
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

    const annee =
      date.getFullYear();

    const mois =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    const jour =
      String(date.getDate())
        .padStart(2, '0');

    return `${annee}-${mois}-${jour}`;

  }


  // =========================
  // VÉRIFIER RENDEZ-VOUS
  // =========================

  aRendezVous(
    date: Date,
    heure: number,
    minute: number
  ): boolean {

    if (!date) {
      return false;
    }

    const datePlanning =
      this.formatDateComparaison(date);

    return this.rendezVous().some(rdv => {

      // Ignorer les rendez-vous annulés
      if (rdv.annule === true) {
        return false;
      }

      // Ignorer les rendez-vous administratifs
      if (!rdv.medecin) {
        return false;
      }

      const dateRdv =
        rdv.dateHeure.substring(0, 10);

      const heureRdv =
        Number(
          rdv.dateHeure.substring(11, 13)
        );

      const minuteRdv =
        Number(
          rdv.dateHeure.substring(14, 16)
        );

      return (
        dateRdv === datePlanning &&
        heureRdv === heure &&
        minuteRdv === minute
      );

    });

  }


  // =========================
  // OUVRIR RENDEZ-VOUS
  // =========================

  ouvrirRendezVous(
    date: Date,
    heure: number,
    minute: number
  ): void {

    if (!date) {
      return;
    }

    const datePlanning =
      this.formatDateComparaison(date);

    const rdv =
      this.rendezVous().find(rdv => {

        // Ignorer les rendez-vous annulés
        if (rdv.annule === true) {
          return false;
        }

        // Ignorer les rendez-vous administratifs
        if (!rdv.medecin) {
          return false;
        }

        const dateRdv =
          rdv.dateHeure.substring(0, 10);

        const heureRdv =
          Number(
            rdv.dateHeure.substring(11, 13)
          );

        const minuteRdv =
          Number(
            rdv.dateHeure.substring(14, 16)
          );

        return (
          dateRdv === datePlanning &&
          heureRdv === heure &&
          minuteRdv === minute
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
  // FORMAT SEMAINE
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
      new Date(
        valeur + 'T00:00:00'
      );

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


  // =========================
  // AUJOURD'HUI
  // =========================

  aujourdhui(): void {

    this.genererSemaine();

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