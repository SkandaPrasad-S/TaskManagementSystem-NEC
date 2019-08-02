import { TestBed } from '@angular/core/testing';

import { UpdateServiceService } from './update-service.service';

describe('UpdateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateServiceService = TestBed.get(UpdateServiceService);
    expect(service).toBeTruthy();
  });
});
