import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerValidationComponent } from './server-validation.component';

describe('ServerValidationComponent', () => {
  let component: ServerValidationComponent;
  let fixture: ComponentFixture<ServerValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerValidationComponent]
    });
    fixture = TestBed.createComponent(ServerValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
