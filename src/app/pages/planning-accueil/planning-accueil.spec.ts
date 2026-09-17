import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningAccueil } from './planning-accueil';

describe('PlanningAccueil', () => {
  let component: PlanningAccueil;
  let fixture: ComponentFixture<PlanningAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningAccueil],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
