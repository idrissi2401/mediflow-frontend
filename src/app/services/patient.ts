import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/api/patients';

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
  // RÉCUPÉRER TOUS LES PATIENTS
  // =========================

  getAllPatients(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // RÉCUPÉRER UN PATIENT
  // =========================

  getPatientById(
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
  // CRÉER UN PATIENT
  // =========================

  creerPatient(
    patient: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      patient,
      {
        headers: this.getHeaders()
      }
    );
  }


  // =========================
  // MODIFIER UN PATIENT
  // =========================

  modifierPatient(
    id: number,
    patient: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      patient,
      {
        headers: this.getHeaders()
      }
    );
  }

}