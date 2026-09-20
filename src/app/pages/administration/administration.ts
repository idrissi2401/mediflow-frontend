import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  UtilisateurService
} from '../../services/utilisateur';

import {
  jwtDecode
} from 'jwt-decode';


@Component({
  selector: 'app-administration',
  imports: [],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class Administration implements OnInit {

  // =========================
  // UTILISATEUR CONNECTÉ
  // =========================

  emailUtilisateurConnecte: string = '';


  // =========================
  // LISTE UTILISATEURS
  // =========================

  utilisateurs: any[] = [];

  chargement: boolean = true;

  erreur: string = '';


  // =========================
  // POPUP NOUVEL UTILISATEUR
  // =========================

  popupNouvelUtilisateur: boolean = false;

  nom: string = '';
  prenom: string = '';
  email: string = '';
  motDePasse: string = '';
  role: string = 'MEDECIN';
  actif: boolean = true;

  erreurCreation: string = '';
  creationEnCours: boolean = false;


  // =========================
  // POPUP MODIFICATION
  // =========================

  popupUtilisateur: boolean = false;

  utilisateurSelectionne: any = null;

  nomModification: string = '';
  prenomModification: string = '';
  emailModification: string = '';
  roleModification: string = '';
  actifModification: boolean = true;

  erreurModification: string = '';
  modificationEnCours: boolean = false;


  constructor(
    private utilisateurService: UtilisateurService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.recupererUtilisateurConnecte();

    this.chargerUtilisateurs();

  }


  // =========================
  // UTILISATEUR CONNECTÉ
  // =========================

  recupererUtilisateurConnecte(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const decoded: any = jwtDecode(token);

      this.emailUtilisateurConnecte =
        decoded.sub || '';

    } catch (error) {

      console.log(
        'Erreur lecture du token :',
        error
      );

    }

  }


  estUtilisateurConnecte(): boolean {

    if (!this.utilisateurSelectionne) {
      return false;
    }

    return (
      this.utilisateurSelectionne.email
        ?.toLowerCase() ===
      this.emailUtilisateurConnecte
        .toLowerCase()
    );

  }


  // =========================
  // CHARGER LES UTILISATEURS
  // =========================

  chargerUtilisateurs(): void {

    this.chargement = true;

    this.erreur = '';

    this.utilisateurService
      .getAllUtilisateurs()
      .subscribe({

        next: (utilisateurs) => {

          this.utilisateurs = utilisateurs;

          this.chargement = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.log(
            'Erreur utilisateurs :',
            error
          );

          this.erreur =
            'Impossible de charger les utilisateurs.';

          this.chargement = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // OUVRIR NOUVEL UTILISATEUR
  // =========================

  ouvrirNouveauUtilisateur(): void {

    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.motDePasse = '';
    this.role = 'MEDECIN';
    this.actif = true;

    this.erreurCreation = '';
    this.creationEnCours = false;

    this.popupNouvelUtilisateur = true;

  }


  // =========================
  // FERMER NOUVEL UTILISATEUR
  // =========================

  fermerNouveauUtilisateur(): void {

    if (this.creationEnCours) {
      return;
    }

    this.popupNouvelUtilisateur = false;

  }


  // =========================
  // CRÉER UTILISATEUR
  // =========================

  creerUtilisateur(): void {

    this.erreurCreation = '';


    // NOM

    if (!this.nom.trim()) {

      this.erreurCreation =
        'Le nom est obligatoire.';

      return;

    }


    // PRÉNOM

    if (!this.prenom.trim()) {

      this.erreurCreation =
        'Le prénom est obligatoire.';

      return;

    }


    // EMAIL

    if (!this.email.trim()) {

      this.erreurCreation =
        'L\'adresse email est obligatoire.';

      return;

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(this.email.trim())) {

      this.erreurCreation =
        'L\'adresse email est invalide.';

      return;

    }


    // MOT DE PASSE

    if (!this.motDePasse.trim()) {

      this.erreurCreation =
        'Le mot de passe est obligatoire.';

      return;

    }


    // =========================
    // OBJET UTILISATEUR
    // =========================

    const nouvelUtilisateur = {

      nom:
        this.nom.trim(),

      prenom:
        this.prenom.trim(),

      email:
        this.email
          .trim()
          .toLowerCase(),

      motDePasse:
        this.motDePasse,

      role:
        this.role,

      actif:
        this.actif

    };


    this.creationEnCours = true;


    // =========================
    // APPEL BACKEND
    // =========================

    this.utilisateurService
      .creerUtilisateur(
        nouvelUtilisateur
      )
      .subscribe({

        next: () => {

          this.creationEnCours = false;

          this.popupNouvelUtilisateur = false;

          this.chargerUtilisateurs();

        },

        error: (error) => {

          console.log(
            'Erreur création utilisateur :',
            error
          );

          this.creationEnCours = false;


          if (
            error.status === 400 &&
            typeof error.error === 'string'
          ) {

            this.erreurCreation =
              error.error;

          } else {

            this.erreurCreation =
              'Impossible de créer l\'utilisateur.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // OUVRIR UTILISATEUR
  // =========================

  ouvrirUtilisateur(
    utilisateur: any
  ): void {

    this.utilisateurSelectionne =
      utilisateur;

    this.nomModification =
      utilisateur.nom;

    this.prenomModification =
      utilisateur.prenom;

    this.emailModification =
      utilisateur.email;

    this.roleModification =
      utilisateur.role;

    this.actifModification =
      utilisateur.actif;

    this.erreurModification = '';

    this.modificationEnCours = false;

    this.popupUtilisateur = true;

  }


  // =========================
  // FERMER UTILISATEUR
  // =========================

  fermerUtilisateur(): void {

    if (this.modificationEnCours) {
      return;
    }

    this.popupUtilisateur = false;

    this.utilisateurSelectionne = null;

  }


  // =========================
  // MODIFIER UTILISATEUR
  // =========================

  modifierUtilisateur(): void {

    this.erreurModification = '';


    // NOM

    if (!this.nomModification.trim()) {

      this.erreurModification =
        'Le nom est obligatoire.';

      return;

    }


    // PRÉNOM

    if (!this.prenomModification.trim()) {

      this.erreurModification =
        'Le prénom est obligatoire.';

      return;

    }


    // EMAIL

    if (!this.emailModification.trim()) {

      this.erreurModification =
        'L\'adresse email est obligatoire.';

      return;

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailRegex.test(
        this.emailModification.trim()
      )
    ) {

      this.erreurModification =
        'L\'adresse email est invalide.';

      return;

    }


    // =========================
    // AUTO-DÉSACTIVATION
    // =========================

    if (
      this.estUtilisateurConnecte() &&
      !this.actifModification
    ) {

      this.erreurModification =
        'Vous ne pouvez pas désactiver votre propre compte.';

      return;

    }


    // =========================
    // OBJET MODIFIÉ
    // =========================

    const utilisateurModifie = {

      nom:
        this.nomModification.trim(),

      prenom:
        this.prenomModification.trim(),

      email:
        this.emailModification
          .trim()
          .toLowerCase(),

      role:
        this.roleModification,

      actif:
        this.actifModification

    };


    this.modificationEnCours = true;


    // =========================
    // APPEL BACKEND
    // =========================

    this.utilisateurService
      .modifierUtilisateur(
        this.utilisateurSelectionne.id,
        utilisateurModifie
      )
      .subscribe({

        next: () => {

          this.modificationEnCours = false;

          this.popupUtilisateur = false;

          this.utilisateurSelectionne = null;

          this.chargerUtilisateurs();

        },

        error: (error) => {

          console.log(
            'Erreur modification utilisateur :',
            error
          );

          this.modificationEnCours = false;


          if (
            error.status === 400 &&
            typeof error.error === 'string'
          ) {

            this.erreurModification =
              error.error;

          } else {

            this.erreurModification =
              'Impossible de modifier l\'utilisateur.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =========================
  // DÉCONNEXION
  // =========================

  deconnexion(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

}