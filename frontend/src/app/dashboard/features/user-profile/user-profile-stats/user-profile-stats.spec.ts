import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileStats } from './user-profile-stats';

describe('UserProfileStats', () => {
  let component: UserProfileStats;
  let fixture: ComponentFixture<UserProfileStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
