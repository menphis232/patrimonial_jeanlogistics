import { TestBed } from '@angular/core/testing';

import { DropzoneService } from './dropzone.service';

describe('DropzoneService', () => {
  let service: DropzoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropzoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
