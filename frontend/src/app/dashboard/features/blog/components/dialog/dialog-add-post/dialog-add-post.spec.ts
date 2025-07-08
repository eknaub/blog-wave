import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPost } from './dialog-add-post';

describe('DialogAddComment', () => {
  let component: DialogAddPost;
  let fixture: ComponentFixture<DialogAddPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddPost],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
