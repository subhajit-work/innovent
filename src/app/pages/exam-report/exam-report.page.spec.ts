import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamReportPage } from './exam-report.page';

describe('ExamReportPage', () => {
  let component: ExamReportPage;
  let fixture: ComponentFixture<ExamReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
