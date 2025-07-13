import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogAddPost } from './dialog-add-post';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Post } from '../../../../../../shared/interfaces/post';

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

  it('should close dialog on onNoClick', () => {
    component.onNoClick();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should log error if title or content is empty on onSubmit', () => {
    spyOn(component.logger, 'error');
    component.postForm.setValue({ title: '', content: '' });
    component.onSubmit();
    expect(component.logger.error).toHaveBeenCalledWith(
      'Title and content are required'
    );
  });

  it('should log error if form is invalid on onSubmit', () => {
    spyOn(component.logger, 'error');
    component.postForm.setValue({
      title: 'Invalid Title!',
      content: 'Valid content',
    });
    component.onSubmit();
    expect(component.logger.error).toHaveBeenCalledWith('Form is invalid');
  });

  it('should call blogService uploadPost on valid form submission', () => {
    const mockPost: Post = {
      id: 1,
      title: 'Valid Title',
      content: 'Valid content for the post.',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
      users: {
        id: 1,
        username: 'testuser',
        email: 'user@example.com',
      },
    };
    spyOn(component.blogService, 'uploadPost').and.returnValue(of(mockPost));
    spyOn(component.logger, 'log');
    component.postForm.setValue({
      title: 'Valid Title',
      content: 'Valid content for the post.',
    });

    component.onSubmit();

    expect(component.dialogRef.close).toHaveBeenCalled();
    expect(component.blogService.uploadPost).toHaveBeenCalledWith(
      'Valid Title',
      'Valid content for the post.'
    );
    expect(component.logger.log).toHaveBeenCalledWith(
      'Post created successfully'
    );
  });

  it('should log error if uploadPost fails', () => {
    spyOn(component.blogService, 'uploadPost').and.returnValue(
      throwError(() => new Error('Failed to create post'))
    );
    spyOn(component.logger, 'error');
    component.postForm.setValue({
      title: 'Valid Title',
      content: 'Valid content for the post.',
    });

    component.onSubmit();

    expect(component.logger.error).toHaveBeenCalledWith(
      'Failed to create post'
    );
  });
});
