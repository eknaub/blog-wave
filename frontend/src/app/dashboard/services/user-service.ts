import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users = httpResource<User[]>(() => ({
    url: `${environment.apiUrl}/users`,
  }));
}
