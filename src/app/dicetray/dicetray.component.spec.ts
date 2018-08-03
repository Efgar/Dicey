import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicetrayComponent } from './dicetray.component';

describe('DicetrayComponent', () => {
  let component: DicetrayComponent;
  let fixture: ComponentFixture<DicetrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicetrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicetrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
