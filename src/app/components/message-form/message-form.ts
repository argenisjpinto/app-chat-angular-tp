import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message-form.html',
  styleUrl: './message-form.css',
})
export class MessageForm {
  @Output() messageSubmitted = new EventEmitter<string>();

  private fb = inject(FormBuilder);

  messageForm: FormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.maxLength(250)]],
  });

  onSubmit(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    const text = this.messageForm.value.text.trim();

    if (!text) return;

    this.messageSubmitted.emit(text);
    this.messageForm.reset();
  }

  get textControl() {
    return this.messageForm.get('text');
  }
}