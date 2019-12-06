import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { map } from 'rxjs/operators';
import { RefSet } from '../models/refset';

import { TerminologyServerService } from './terminologyServer.service';

describe('TerminologyServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule], 
        providers: [TerminologyServerService]
      }));

  it('should be created', () => {
    const service: TerminologyServerService = TestBed.get(TerminologyServerService);
    expect(service).toBeTruthy();
  });
});
