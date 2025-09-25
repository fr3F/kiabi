import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMagasinPageComponent } from './detail-magasin-page.component';

describe('DetailMagasinPageComponent', () => {
  let component: DetailMagasinPageComponent;
  let fixture: ComponentFixture<DetailMagasinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMagasinPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMagasinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
