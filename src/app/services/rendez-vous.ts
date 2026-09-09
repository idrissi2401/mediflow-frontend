import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezVous {

  private apiUrl = 'http://localhost:8080/api/rendez-vous';

  constructor(private http: HttpClient) {}


  getRendezVous(): Observable<any[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(
      this.apiUrl,
      { headers }
    );

  }


  getRendezVousById(id: number): Observable<any> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      { headers }
    );

  }

}