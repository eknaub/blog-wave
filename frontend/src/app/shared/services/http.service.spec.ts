import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BaseHttpService } from './http.service';

describe('BaseHttpService', () => {
  let service: BaseHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseHttpService,
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(BaseHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should make GET request and return data', () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = { data: mockData };

      service.get<typeof mockData>('/test').subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test');
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('post', () => {
    it('should make POST request with body and return data', () => {
      const mockData = { id: 1, name: 'Created' };
      const mockResponse = { data: mockData };
      const body = { name: 'Test' };

      service.post<typeof mockData>('/test', body).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('put', () => {
    it('should make PUT request with body and return data', () => {
      const mockData = { id: 1, name: 'Updated' };
      const mockResponse = { data: mockData };
      const body = { name: 'Updated Test' };

      service.put<typeof mockData>('/test/1', body).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should make DELETE request and return data', () => {
      const mockData = { success: true };
      const mockResponse = { data: mockData };

      service.delete<typeof mockData>('/test/1').subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('patch', () => {
    it('should make PATCH request with body and return data', () => {
      const mockData = { id: 1, name: 'Patched' };
      const mockResponse = { data: mockData };
      const body = { name: 'Patched Test' };

      service.patch<typeof mockData>('/test/1', body).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/test/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(body);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });
});
