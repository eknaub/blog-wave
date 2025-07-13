import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { UserCard } from './user-card';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../../../../../shared/interfaces/user';

describe('UserCard', () => {
  let component: UserCard;
  let fixture: ComponentFixture<UserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('user', {
      id: 1,
      username: 'Test User',
      email: 'user@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
