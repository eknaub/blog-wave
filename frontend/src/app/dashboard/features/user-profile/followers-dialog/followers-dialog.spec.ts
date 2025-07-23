import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowersDialog } from './followers-dialog';

describe('FollowersDialog', () => {
  let component: FollowersDialog;
  let fixture: ComponentFixture<FollowersDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowersDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowersDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
