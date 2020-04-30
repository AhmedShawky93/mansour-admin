import { TestBed, inject } from '@angular/core/testing';

import { AdminsService } from './admins.service';

describe('AdminsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminsService]
    });
  });

  it('should be created', inject([AdminsService], (service: AdminsService) => {
    expect(service).toBeTruthy();
  }));
});
