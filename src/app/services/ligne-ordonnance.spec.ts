import { TestBed } from '@angular/core/testing';

import { LigneOrdonnance } from './ligne-ordonnance';

describe('LigneOrdonnance', () => {
  let service: LigneOrdonnance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LigneOrdonnance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
