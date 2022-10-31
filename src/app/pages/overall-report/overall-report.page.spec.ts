import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OverallReportPage } from './overall-report.page';

describe('OverallReportPage', () => {
  let component: OverallReportPage;
  let fixture: ComponentFixture<OverallReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OverallReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
