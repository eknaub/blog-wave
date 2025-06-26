import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <div>
      <p>Username: {{ userName }}</p>
      <p>Email: {{ email }}</p>
      <p>Age: {{ age }}</p>
      <button (click)="handleDeleteUser()">Delete User</button>
    </div>
  `,
})
export class User {
  @Input() userName: string = '';
  @Input() email: string = '';
  @Input() age: number = 0;
  @Output() deleteUser: EventEmitter<string> = new EventEmitter<string>();

  handleDeleteUser() {
    this.deleteUser.emit();
  }
}
