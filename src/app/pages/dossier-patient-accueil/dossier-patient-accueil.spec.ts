import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierPatientAccueil } from './dossier-patient-accueil';

describe('DossierPatientAccueil', () => {
  let component: DossierPatientAccueil;
  let fixture: ComponentFixture<DossierPatientAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierPatientAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(DossierPatientAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
