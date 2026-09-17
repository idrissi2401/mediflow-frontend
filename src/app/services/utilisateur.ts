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

}