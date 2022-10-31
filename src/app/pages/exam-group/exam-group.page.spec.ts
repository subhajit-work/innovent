import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamGroupPage } from './exam-group.page';

describe('ExamGroupPage', () => {
  let component: ExamGroupPage;
  let fixture: ComponentFixture<ExamGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
