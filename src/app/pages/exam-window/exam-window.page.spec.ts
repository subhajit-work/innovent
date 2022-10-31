import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamWindowPage } from './exam-window.page';

describe('ExamWindowPage', () => {
  let component: ExamWindowPage;
  let fixture: ComponentFixture<ExamWindowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamWindowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamWindowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
