import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  connexion(email: string, motDePasse: string): Observable<string> {

    return this.http.post(
      this.apiUrl,
      {
        email: email,
        motDePasse: motDePasse
      },
      {
        responseType: 'text'
      }
    );

  }

}