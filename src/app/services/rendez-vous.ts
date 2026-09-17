import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezVous {

  private apiUrl = 'http://localhost:8080/api/rendez-vous';

  constructor(private http: HttpClient) {}


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
  // RÉCUPÉRER LES RENDEZ-VOUS
  // =========================

  getRendezVous(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );

  }


  // =========================
  // RÉCUPÉRER UN RENDEZ-VOUS
  // =========================

  getRendezVousById(id: number): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );

  }


  // =========================
  // CRÉER UN RENDEZ-VOUS
  // =========================

  creerRendezVous(
    rendezVous: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      rendezVous,
      {
        headers: this.getHeaders()
      }
    );

  }


  // =========================
  // MODIFIER UN RENDEZ-VOUS
  // =========================

  modifierRendezVous(
    id: number,
    rendezVous: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      rendezVous,
      {
        headers: this.getHeaders()
      }
    );

  }

}