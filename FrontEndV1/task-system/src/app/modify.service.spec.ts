import { TestBed } from '@angular/core/testing';

import { ModifyService } from './modify.service';

describe('ModifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModifyService = TestBed.get(ModifyService);
    expect(service).toBeTruthy();
  });
});
