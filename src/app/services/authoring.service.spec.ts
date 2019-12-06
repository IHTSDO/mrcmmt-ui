import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RefSet } from '../models/refset';

import { AuthoringService } from './authoring.service';

describe('AuthoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthoringService]
      }));

  it('should be created', () => {
    const service: AuthoringService = TestBed.get(AuthoringService);
    expect(service).toBeTruthy();
  });
});
