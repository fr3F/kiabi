import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendClientKiabiComponent } from './send-client-kiabi.component';

describe('SendClientKiabiComponent', () => {
  let component: SendClientKiabiComponent;
  let fixture: ComponentFixture<SendClientKiabiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendClientKiabiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendClientKiabiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
