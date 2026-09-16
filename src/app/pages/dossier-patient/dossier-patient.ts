import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { PatientService } from '../../services/patient';
import { ConsultationService } from '../../services/consultation';
import { OrdonnanceService } from '../../services/ordonnance';
import { LigneOrdonnanceService } from '../../services/ligne-ordonnance';


@Component({
  selector: 'app-dossier-patient',
  imports: [
    RouterLink
  ],
  templateUrl: './dossier-patient.html',
  styleUrl: './dossier-patient.css'
})
export class DossierPatient implements OnInit {

  // =========================
  // PATIENT
  // =========================

  patientId: number = 0;

  patient: any = null;


  // =========================
  // CONSULTATIONS
  // =========================

  consultations: any[] = [];


  // =========================
  // ÉTAT DE LA PAGE
  // =========================

  chargement: boolean = true;

  erreur: string = '';


  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private ordonnanceService: OrdonnanceService,
    private ligneOrdonnanceService: LigneOrdonnanceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    this.patientId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.chargerPatient();

    this.chargerConsultations();
  }


  // =========================
  // CHARGER LE PATIENT
  // =========================

  chargerPatient(): void {

    this.chargement = true;

    this.erreur = '';

    this.patientService
      .getPatientById(this.patientId)
      .subscribe({

        next: (data) => {

          this.patient = data;

          this.chargement = false;

          console.log(
            'Patient récupéré :',
            this.patient
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(
            'Erreur récupération patient :',
            error
          );

          this.erreur =
            'Impossible de récupérer le patient.';

          this.chargement = false;

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // CHARGER LES CONSULTATIONS
  // =========================

  chargerConsultations(): void {

    this.consultationService
      .getConsultationsByPatientId(
        this.patientId
      )
      .subscribe({

        next: (data) => {

          this.consultations = data.map(
            (consultation: any) => ({
              ...consultation,

              ordonnance: null,

              lignesOrdonnance: [],

              chargementOrdonnance: true
            })
          );

          console.log(
            'Consultations du patient récupérées :',
            this.consultations
          );

          this.cdr.detectChanges();


          // Charger l'ordonnance de
          // chaque consultation
          this.consultations.forEach(
            consultation => {

              this.chargerOrdonnance(
                consultation
              );

            }
          );
        },

        error: (error) => {

          console.log(
            'Erreur récupération consultations :',
            error
          );

          this.consultations = [];

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // CHARGER ORDONNANCE
  // D'UNE CONSULTATION
  // =========================

  chargerOrdonnance(
    consultation: any
  ): void {

    this.ordonnanceService
      .getOrdonnanceByConsultationId(
        consultation.id
      )
      .subscribe({

        next: (ordonnance) => {

          consultation.ordonnance =
            ordonnance;

          console.log(
            'Ordonnance trouvée pour consultation',
            consultation.id,
            ':',
            ordonnance
          );


          // Une ordonnance existe :
          // récupérer ses médicaments
          this.chargerLignesOrdonnance(
            consultation,
            ordonnance.id
          );
        },

        error: (error) => {

          /*
           * 404 = cette consultation
           * n'a simplement pas
           * d'ordonnance.
           */
          if (error.status === 404) {

            consultation.ordonnance = null;

            consultation.lignesOrdonnance = [];

            consultation.chargementOrdonnance =
              false;

          } else {

            console.log(
              'Erreur récupération ordonnance ' +
              'pour consultation ' +
              consultation.id +
              ' :',
              error
            );

            consultation.ordonnance = null;

            consultation.lignesOrdonnance = [];

            consultation.chargementOrdonnance =
              false;
          }

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // CHARGER MÉDICAMENTS
  // =========================

  chargerLignesOrdonnance(
    consultation: any,
    ordonnanceId: number
  ): void {

    this.ligneOrdonnanceService
      .getLignesByOrdonnance(
        ordonnanceId
      )
      .subscribe({

        next: (lignes) => {

          consultation.lignesOrdonnance =
            lignes;

          consultation.chargementOrdonnance =
            false;

          console.log(
            'Médicaments consultation',
            consultation.id,
            ':',
            lignes
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(
            'Erreur récupération médicaments ' +
            'consultation ' +
            consultation.id +
            ' :',
            error
          );

          consultation.lignesOrdonnance = [];

          consultation.chargementOrdonnance =
            false;

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // FORMATER DATE
  // =========================

  formatDate(
    dateHeure: string
  ): string {

    if (!dateHeure) {
      return '-';
    }

    const date = new Date(
      dateHeure
    );

    return date.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  }


  // =========================
  // FORMATER HEURE
  // =========================

  formatHeure(
    dateHeure: string
  ): string {

    if (!dateHeure) {
      return '';
    }

    const date = new Date(
      dateHeure
    );

    return date.toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  // =========================
  // DÉCONNEXION
  // =========================

  deconnexion(): void {

    localStorage.removeItem('token');

    this.router.navigate([
      '/login'
    ]);
  }

}