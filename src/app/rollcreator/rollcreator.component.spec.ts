import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollcreatorComponent } from './rollcreator.component';

describe('RollcreatorComponent', () => {
  let component: RollcreatorComponent;
  let fixture: ComponentFixture<RollcreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollcreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollcreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
