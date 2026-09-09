import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RendezVous } from '../../services/rendez-vous';

@Component({
  selector: 'app-consultation',
  imports: [],
  templateUrl: './consultation.html',
  styleUrl: './consultation.css',
})
export class Consultation implements OnInit {

  rendezVousId: number = 0;
  rendezVous: any = null;

  constructor(
    private route: ActivatedRoute,
    private rendezVousService: RendezVous
  ) {}

  ngOnInit(): void {

    this.rendezVousId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.rendezVousService
      .getRendezVousById(this.rendezVousId)
      .subscribe({

        next: (data) => {

          this.rendezVous = data;

          console.log(
            'Rendez-vous récupéré :',
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

}