import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMagasinComponent } from './info-magasin.component';

describe('InfoMagasinComponent', () => {
  let component: InfoMagasinComponent;
  let fixture: ComponentFixture<InfoMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoMagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
