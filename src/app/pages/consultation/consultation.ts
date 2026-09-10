import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RendezVous } from '../../services/rendez-vous';
import { ConsultationService } from '../../services/consultation';

@Component({
  selector: 'app-consultation',
  imports: [FormsModule],
  templateUrl: './consultation.html',
  styleUrl: './consultation.css',
})
export class Consultation implements OnInit {

  rendezVousId: number = 0;
  rendezVous = signal<any>(null);

  diagnostic: string = '';
  notes: string = '';

  messageSucces: string = '';

  constructor(
    private route: ActivatedRoute,
    private rendezVousService: RendezVous,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {

    this.rendezVousId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.rendezVousService
      .getRendezVousById(this.rendezVousId)
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

  enregistrerConsultation(): void {

    const consultation = {
      dateHeure: new Date().toISOString().slice(0, 19),
      notes: this.notes,
      diagnostic: this.diagnostic,
      rendezVous: {
        id: this.rendezVousId
      }
    };

    this.consultationService
      .creerConsultation(consultation)
      .subscribe({
        next: () => {
          this.messageSucces =
            'Consultation enregistrée avec succès.';
        },
        error: (error) => {
          console.log(
            'Erreur enregistrement consultation :',
            error
          );
        }
      });
  }
}