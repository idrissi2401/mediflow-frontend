import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsAccueil } from './patients-accueil';

describe('PatientsAccueil', () => {
  let component: PatientsAccueil;
  let fixture: ComponentFixture<PatientsAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientsAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
