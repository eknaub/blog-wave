import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Blog } from './blog';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DialogAddPost } from './components/dialog/dialog-add-post/dialog-add-post';
import { MatDialog } from '@angular/material/dialog';

describe('Blog', () => {
  let component: Blog;
  let fixture: ComponentFixture<Blog>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [Blog],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Blog);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog when openDialog is called', () => {
    component.openDialog();

    expect(mockDialog.open).toHaveBeenCalledWith(DialogAddPost);
  });

  it('should open dialog when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(mockDialog.open).toHaveBeenCalledWith(DialogAddPost);
  });
});
