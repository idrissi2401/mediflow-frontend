import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
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
    private rendezVousService: RendezVous,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.genererSemaine();

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


  ouvrirRendezVous(
    date: Date,
    heure: number
  ): void {

    if (!date) {
      return;
    }

    const datePlanning =
      this.formatDateComparaison(date);

    const rdv = this.rendezVous().find(rdv => {

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