import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSagePageComponent } from './import-sage-page.component';

describe('ImportSagePageComponent', () => {
  let component: ImportSagePageComponent;
  let fixture: ComponentFixture<ImportSagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSagePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
