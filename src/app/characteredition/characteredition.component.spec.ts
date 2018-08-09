import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactereditionComponent } from './characteredition.component';

describe('CharactereditionComponent', () => {
  let component: CharactereditionComponent;
  let fixture: ComponentFixture<CharactereditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactereditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharactereditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
