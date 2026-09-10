import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://localhost:8080/api/consultations';

  constructor(
    private http: HttpClient
  ) {}


  creerConsultation(consultation: any): Observable<any> {

    const token = localStorage.getItem('token');

    console.log(
      'Token envoyé pour consultation :',
      token
    );

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(
      this.apiUrl,
      consultation,
      { headers }
    );

  }

}