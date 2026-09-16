import {
  ChangeDetectorRef,
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { RendezVous } from '../../services/rendez-vous';
import { ConsultationService } from '../../services/consultation';
import { OrdonnanceService } from '../../services/ordonnance';
import { LigneOrdonnanceService } from '../../services/ligne-ordonnance';


@Component({
  selector: 'app-consultation',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './consultation.html',
  styleUrl: './consultation.css',
})
export class Consultation implements OnInit {

  rendezVousId: number = 0;

  rendezVous = signal<any>(null);


  // =========================
  // CONSULTATION
  // =========================

  diagnostic: string = '';

  notes: string = '';

  consultationId: number | null = null;

  messageSucces: string = '';


  // =========================
  // ORDONNANCE
  // =========================

  ordonnanceId: number | null = null;

  messageOrdonnance: string = '';

  lignesOrdonnance: any[] = [
    {
      id: null,
      medicament: '',
      dosage: '',
      frequence: '',
      duree: ''
    }
  ];


  constructor(
    private route: ActivatedRoute,
    private rendezVousService: RendezVous,
    private consultationService: ConsultationService,
    private ordonnanceService: OrdonnanceService,
    private ligneOrdonnanceService: LigneOrdonnanceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // =========================
  // INITIALISATION
  // =========================

  ngOnInit(): void {

    this.rendezVousId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.chargerRendezVous();

    this.chargerConsultationExistante();
  }


  // =========================
  // CHARGER RENDEZ-VOUS
  // =========================

  chargerRendezVous(): void {

    this.rendezVousService
      .getRendezVousById(this.rendezVousId)
      .subscribe({

        next: (data) => {

          this.rendezVous.set(data);

          this.cdr.detectChanges();
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
  // CHARGER CONSULTATION
  // =========================

  chargerConsultationExistante(): void {

    this.consultationService
      .getConsultationByRendezVousId(
        this.rendezVousId
      )
      .subscribe({

        next: (data) => {

          this.consultationId = data.id;

          this.diagnostic =
            data.diagnostic ?? '';

          this.notes =
            data.notes ?? '';

          console.log(
            'Consultation existante trouvée :',
            this.consultationId
          );

          this.cdr.detectChanges();

          // Chercher l'ordonnance
          this.chargerOrdonnanceExistante();
        },

        error: (error) => {

          if (error.status === 404) {

            this.consultationId = null;

            this.ordonnanceId = null;

            console.log(
              'Aucune consultation existante.'
            );

          } else {

            console.log(
              'Erreur récupération consultation :',
              error
            );
          }

        }

      });
  }


  // =========================
  // CHARGER ORDONNANCE
  // =========================

  chargerOrdonnanceExistante(): void {

    if (this.consultationId === null) {
      return;
    }

    this.ordonnanceService
      .getOrdonnanceByConsultationId(
        this.consultationId
      )
      .subscribe({

        next: (data) => {

          this.ordonnanceId = data.id;

          console.log(
            'Ordonnance existante trouvée :',
            this.ordonnanceId
          );

          this.chargerLignesOrdonnance();
        },

        error: (error) => {

          if (error.status === 404) {

            this.ordonnanceId = null;

            this.lignesOrdonnance = [
              {
                id: null,
                medicament: '',
                dosage: '',
                frequence: '',
                duree: ''
              }
            ];

            this.cdr.detectChanges();

            console.log(
              'Aucune ordonnance existante.'
            );

          } else {

            console.log(
              'Erreur récupération ordonnance :',
              error
            );
          }

        }

      });
  }


  // =========================
  // CHARGER LIGNES ORDONNANCE
  // =========================

  chargerLignesOrdonnance(): void {

    if (this.ordonnanceId === null) {
      return;
    }

    this.ligneOrdonnanceService
      .getLignesByOrdonnance(
        this.ordonnanceId
      )
      .subscribe({

        next: (data) => {

          if (data.length > 0) {

            this.lignesOrdonnance =
              data.map((ligne: any) => ({

                id: ligne.id,

                medicament:
                  ligne.medicament ?? '',

                dosage:
                  ligne.dosage ?? '',

                frequence:
                  ligne.frequence ?? '',

                duree:
                  ligne.duree ?? ''

              }));

          } else {

            this.lignesOrdonnance = [
              {
                id: null,
                medicament: '',
                dosage: '',
                frequence: '',
                duree: ''
              }
            ];
          }

          console.log(
            'Lignes ordonnance récupérées :',
            data
          );

          // Force l'affichage immédiatement
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(
            'Erreur récupération lignes ordonnance :',
            error
          );
        }

      });
  }


  // =========================
  // ENREGISTRER CONSULTATION
  // =========================

  enregistrerConsultation(): void {

    this.messageSucces = '';

    const consultation = {

      dateHeure: new Date()
        .toISOString()
        .slice(0, 19),

      notes: this.notes,

      diagnostic: this.diagnostic,

      rendezVous: {
        id: this.rendezVousId
      }

    };


    // Nouvelle consultation
    if (this.consultationId === null) {

      this.consultationService
        .creerConsultation(consultation)
        .subscribe({

          next: (data) => {

            this.consultationId =
              data.id;

            this.messageSucces =
              'Consultation enregistrée avec succès.';

            console.log(
              'Consultation créée - ID :',
              this.consultationId
            );

            this.cdr.detectChanges();
          },

          error: (error) => {

            console.log(
              'Erreur création consultation :',
              error
            );
          }

        });

      return;
    }


    // Consultation existante
    this.consultationService
      .modifierConsultation(
        this.consultationId,
        consultation
      )
      .subscribe({

        next: (data) => {

          this.consultationId =
            data.id;

          this.messageSucces =
            'Consultation modifiée avec succès.';

          console.log(
            'Consultation modifiée - ID :',
            this.consultationId
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(
            'Erreur modification consultation :',
            error
          );
        }

      });
  }


  // =========================
  // AJOUTER MÉDICAMENT
  // =========================

  ajouterLigneOrdonnance(): void {

    this.lignesOrdonnance.push({

      id: null,

      medicament: '',

      dosage: '',

      frequence: '',

      duree: ''

    });
  }


  // =========================
  // SUPPRIMER MÉDICAMENT
  // =========================

  supprimerLigneOrdonnance(
    index: number
  ): void {

    const ligne =
      this.lignesOrdonnance[index];


    if (!ligne) {
      return;
    }


    /*
     * Nouvelle ligne :
     * elle n'existe pas encore en BDD.
     */
    if (ligne.id == null) {

      this.lignesOrdonnance.splice(
        index,
        1
      );

      // Toujours conserver au moins
      // une ligne dans le formulaire
      if (this.lignesOrdonnance.length === 0) {

        this.lignesOrdonnance.push({

          id: null,

          medicament: '',

          dosage: '',

          frequence: '',

          duree: ''

        });
      }

      this.cdr.detectChanges();

      return;
    }


    /*
     * Ligne existante :
     * suppression dans la BDD.
     */
    this.ligneOrdonnanceService
      .supprimerLigne(ligne.id)
      .subscribe({

        next: () => {

          this.lignesOrdonnance.splice(
            index,
            1
          );


          if (
            this.lignesOrdonnance.length === 0
          ) {

            this.lignesOrdonnance.push({

              id: null,

              medicament: '',

              dosage: '',

              frequence: '',

              duree: ''

            });

          }


          this.messageOrdonnance =
            'Médicament supprimé avec succès.';

          console.log(
            'Ligne ordonnance supprimée - ID :',
            ligne.id
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(
            'Erreur suppression ligne ordonnance :',
            error
          );
        }

      });
  }


  // =========================
  // ENREGISTRER ORDONNANCE
  // =========================

  enregistrerOrdonnance(): void {

    this.messageOrdonnance = '';

    if (this.consultationId === null) {

      this.messageOrdonnance =
        'Enregistrez d’abord la consultation.';

      return;
    }


    /*
     * Ordonnance existante :
     * enregistrer uniquement
     * les nouvelles lignes.
     */
    if (this.ordonnanceId !== null) {

      this.enregistrerNouvellesLignes(
        this.ordonnanceId
      );

      return;
    }


    /*
     * Nouvelle ordonnance
     */
    const ordonnance = {

      dateHeure: new Date()
        .toISOString()
        .slice(0, 19),

      consultation: {
        id: this.consultationId
      }

    };


    this.ordonnanceService
      .creerOrdonnance(ordonnance)
      .subscribe({

        next: (data) => {

          this.ordonnanceId =
            data.id;

          console.log(
            'ID ordonnance enregistrée :',
            this.ordonnanceId
          );

          this.enregistrerNouvellesLignes(
            this.ordonnanceId!
          );
        },

        error: (error) => {

          console.log(
            'Erreur enregistrement ordonnance :',
            error
          );
        }

      });
  }


  // =========================
  // ENREGISTRER NOUVELLES
  // LIGNES
  // =========================

  enregistrerNouvellesLignes(
    ordonnanceId: number
  ): void {

    const nouvellesLignes =
      this.lignesOrdonnance.filter(
        ligne =>
          ligne.id == null &&
          ligne.medicament.trim() !== '' &&
          ligne.dosage.trim() !== '' &&
          ligne.frequence.trim() !== '' &&
          ligne.duree.trim() !== ''
      );


    if (nouvellesLignes.length === 0) {

      this.messageOrdonnance =
        'Aucun nouveau médicament à enregistrer.';

      return;
    }


    let lignesEnregistrees = 0;


    nouvellesLignes.forEach((ligne) => {

      const ligneAEnvoyer = {

        medicament:
          ligne.medicament,

        dosage:
          ligne.dosage,

        frequence:
          ligne.frequence,

        duree:
          ligne.duree,

        ordonnance: {
          id: ordonnanceId
        }

      };


      this.ligneOrdonnanceService
        .creerLigne(ligneAEnvoyer)
        .subscribe({

          next: (data) => {

            // La ligne existe maintenant en BDD
            ligne.id = data.id;

            lignesEnregistrees++;

            if (
              lignesEnregistrees ===
              nouvellesLignes.length
            ) {

              this.messageOrdonnance =
                'Ordonnance enregistrée avec succès.';

              console.log(
                'Nouvelles lignes enregistrées.'
              );

              this.cdr.detectChanges();
            }
          },

          error: (error) => {

            console.log(
              'Erreur enregistrement ligne ordonnance :',
              error
            );
          }

        });

    });
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