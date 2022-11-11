import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(data: Login): Observable<any> {
    const headers = new HttpHeaders();
    const options = { headers: headers, withCredintials: false };
    return this.http.post<Login>(`${environment.apiBaseUrl}/users/login`, data, options)
  };

  register(data: Login): Observable<any> {
    const headers = new HttpHeaders();
    const options = { headers: headers, withCredintials: false };
    return this.http.post<Login>(`${environment.apiBaseUrl}/users/register`, data, options)
  };

  updateUser(id: number, data: any): Observable<any> {
    const userData = JSON.parse(localStorage.getItem('userData') as string);
    const options = new HttpHeaders({
      'Authorization': `Bearer ${userData.token}`
    });
    options.append('Content-Type', 'multipart/form-data');
    options.append('Accept', 'application/json');
    //options.append('Authorization', `Bearer ${userData.token}`);
    return this.http.post(`${environment.apiBaseUrl}/users/${id}`, data, { headers: options });
  }
}
