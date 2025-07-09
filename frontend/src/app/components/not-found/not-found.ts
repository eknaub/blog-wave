import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../shared/interfaces/routes';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  readonly RouteNames = RouteNames;
}
