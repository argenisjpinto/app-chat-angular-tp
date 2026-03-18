import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChatForm } from './new-chat-form';

describe('NewChatForm', () => {
  let component: NewChatForm;
  let fixture: ComponentFixture<NewChatForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewChatForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewChatForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
