import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
