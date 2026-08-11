import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidtComponent } from './widt.component';

describe('WidtComponent', () => {
  let component: WidtComponent;
  let fixture: ComponentFixture<WidtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
