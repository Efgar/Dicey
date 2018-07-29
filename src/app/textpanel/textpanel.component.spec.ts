import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextpanelComponent } from './textpanel.component';

describe('TextpanelComponent', () => {
  let component: TextpanelComponent;
  let fixture: ComponentFixture<TextpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
