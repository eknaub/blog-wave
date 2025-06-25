import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <div>
      <p>Username: {{ userName }}</p>
      <p>Email: {{ email }}</p>
      <p>Age: {{ age }}</p>
    </div>
  `,
})
export class User {
  @Input() userName: string = '';
  @Input() email: string = '';
  @Input() age: number = 0;
}
