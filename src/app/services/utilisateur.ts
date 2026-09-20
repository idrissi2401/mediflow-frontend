import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(
    private http: HttpClient
  ) {}


  // =========================
  // HEADERS JWT
  // =========================

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }


  // =========================
  // RÉCUPÉRER LES UTILISATEURS
  // =========================

  getAllUtilisateurs(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );

  }


  // =========================
  // RÉCUPÉRER UN UTILISATEUR
  // =========================

  getUtilisateurById(id: number): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );

  }


  // =========================
  // CRÉER UN UTILISATEUR
  // =========================

  creerUtilisateur(utilisateur: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      utilisateur,
      {
        headers: this.getHeaders()
      }
    );

  }


  // =========================
  // MODIFIER UN UTILISATEUR
  // =========================

  modifierUtilisateur(
    id: number,
    utilisateur: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      utilisateur,
      {
        headers: this.getHeaders()
      }
    );

  }

}