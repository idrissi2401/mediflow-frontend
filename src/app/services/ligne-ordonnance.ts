import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigneOrdonnanceService {

  private apiUrl =
    'http://localhost:8080/api/lignes-ordonnance';

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
  // CRÉER UNE LIGNE
  // =========================

  creerLigne(
    ligne: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      ligne,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // RÉCUPÉRER UNE LIGNE
  // =========================

  getLigneById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // LIGNES D'UNE ORDONNANCE
  // =========================

  getLignesByOrdonnance(
    ordonnanceId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/ordonnance/${ordonnanceId}`,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // MODIFIER UNE LIGNE
  // =========================

  modifierLigne(
    id: number,
    ligne: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      ligne,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // SUPPRIMER UNE LIGNE
  // =========================

  supprimerLigne(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }

}