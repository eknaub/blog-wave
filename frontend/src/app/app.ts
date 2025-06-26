import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';

@Component({
  selector: 'app-root',
  template: ` <app-header />
    <router-outlet />`,
  imports: [RouterOutlet, Header],
})
export class App {}
