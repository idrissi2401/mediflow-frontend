import { Component, OnInit, signal } from '@angular/core';
import { RendezVous } from '../../services/rendez-vous';

@Component({
  selector: 'app-planning-medecin',
  imports: [],
  templateUrl: './planning-medecin.html',
  styleUrl: './planning-medecin.css',
})
export class PlanningMedecin implements OnInit {

  rendezVous = signal<any[]>([]);

  joursSemaine: Date[] = [];

  constructor(
    private rendezVousService: RendezVous
  ) {}


  ngOnInit(): void {

    // Génération de la semaine actuelle
    this.genererSemaine();

    // Récupération des rendez-vous depuis le backend
    this.rendezVousService.getRendezVous().subscribe({

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


  // Génère la semaine actuelle
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


  // Affichage 07/09
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


  // Transforme une date en 2026-09-07
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


  // Vérifie s'il existe un rendez-vous actif
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

      // Rendez-vous annulé = non affiché
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


  // Semaine précédente
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


  // Semaine suivante
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

}