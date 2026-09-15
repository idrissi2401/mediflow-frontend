import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {

  private apiUrl = 'http://localhost:8080/api/ordonnances';

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
  // CRÉER UNE ORDONNANCE
  // =========================

  creerOrdonnance(
    ordonnance: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      ordonnance,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // RÉCUPÉRER PAR ID
  // =========================

  getOrdonnanceById(
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
  // RÉCUPÉRER PAR CONSULTATION
  // =========================

  getOrdonnanceByConsultationId(
    consultationId: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/consultation/${consultationId}`,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // MODIFIER UNE ORDONNANCE
  // =========================

  modifierOrdonnance(
    id: number,
    ordonnance: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      ordonnance,
      {
        headers: this.getHeaders()
      }
    );
  }

}