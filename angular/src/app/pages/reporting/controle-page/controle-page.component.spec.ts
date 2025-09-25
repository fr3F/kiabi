import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlePageComponent } from './controle-page.component';

describe('ControlePageComponent', () => {
  let component: ControlePageComponent;
  let fixture: ComponentFixture<ControlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
