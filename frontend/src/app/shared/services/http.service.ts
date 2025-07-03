import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  private http = inject(HttpClient);

  private getOptions() {
    return { withCredentials: true };
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<
        ApiResponse<T>
      >(`${environment.apiUrl}${endpoint}`, this.getOptions())
      .pipe(map((response) => response.data!));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<
        ApiResponse<T>
      >(`${environment.apiUrl}${endpoint}`, body, this.getOptions())
      .pipe(map((response) => response.data!));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<
        ApiResponse<T>
      >(`${environment.apiUrl}${endpoint}`, body, this.getOptions())
      .pipe(map((response) => response.data!));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<
        ApiResponse<T>
      >(`${environment.apiUrl}${endpoint}`, this.getOptions())
      .pipe(map((response) => response.data!));
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .patch<
        ApiResponse<T>
      >(`${environment.apiUrl}${endpoint}`, body, this.getOptions())
      .pipe(map((response) => response.data!));
  }
}
