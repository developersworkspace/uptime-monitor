import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteRouteComponent } from './website-route.component';

describe('WebsiteRouteComponent', () => {
  let component: WebsiteRouteComponent;
  let fixture: ComponentFixture<WebsiteRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
