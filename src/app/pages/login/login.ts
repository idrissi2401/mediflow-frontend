import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  motDePasse: string = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  connexion(): void {

    this.auth
      .connexion(
        this.email,
        this.motDePasse
      )
      .subscribe({

        next: (token) => {

          // Enregistrement du token
          localStorage.setItem(
            'token',
            token
          );

          // Lecture du contenu du token
          const decodedToken: any =
            jwtDecode(token);

          console.log(
            'Token complet :',
            decodedToken
          );

          console.log(
            'Connexion réussie'
          );

          console.log(
            'Rôle :',
            decodedToken.role
          );


          // =========================
          // MÉDECIN
          // =========================

          if (
            decodedToken.role ===
            'MEDECIN'
          ) {

            this.router.navigate([
              '/planning-medecin'
            ]);

            return;
          }


          // =========================
          // ACCUEIL
          // =========================

          if (
            decodedToken.role ===
            'ACCUEIL'
          ) {

            this.router.navigate([
              '/planning-accueil'
            ]);

            return;
          }


          // =========================
          // ADMINISTRATEUR
          // =========================

          if (
            decodedToken.role ===
            'ADMIN'
          ) {

            this.router.navigate([
              '/administration'
            ]);

            return;
          }

        },

        error: (error) => {

          console.log(
            'Erreur de connexion :',
            error
          );

        }

      });
  }

}