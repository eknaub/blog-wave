import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogAddPost } from './dialog-add-post';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

describe('DialogAddPost', () => {
  let component: DialogAddPost;
  let fixture: ComponentFixture<DialogAddPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddPost],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
