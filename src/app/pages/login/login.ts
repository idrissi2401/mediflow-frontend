import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  motDePasse: string = '';

  constructor(private auth: Auth) {}

  connexion() {
    this.auth.connexion(this.email, this.motDePasse).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);

        const decodedToken: any = jwtDecode(token);

        console.log('Connexion réussie');
        console.log('Rôle :', decodedToken.role);
      },
      error: (error) => {
        console.log('Erreur de connexion :', error);
      }
    });
  }

}