import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteElementDialog } from './delete-element-dialog';

describe('DeleteElementDialog', () => {
  let component: DeleteElementDialog;
  let fixture: ComponentFixture<DeleteElementDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteElementDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteElementDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
