import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { GlobalLoadingComponent } from './shared/components/global-loading.component';

@Component({
  selector: 'app-root',
  template: ` <app-header />
    <main><router-outlet /></main>
    <app-global-loading />`,
  imports: [RouterOutlet, Header, GlobalLoadingComponent],
})
export class App {}
