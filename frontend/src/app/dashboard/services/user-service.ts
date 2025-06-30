import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users = httpResource<User[]>(() => `${environment.apiUrl}/users`);
}
