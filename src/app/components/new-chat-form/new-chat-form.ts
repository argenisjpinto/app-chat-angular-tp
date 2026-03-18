import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-chat-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-chat-form.html',
  styleUrl: './new-chat-form.css',
})
export class NewChatForm implements OnChanges {
  @Input() duplicateError = false;
  @Output() chatCreated = new EventEmitter<string>();

  private fb = inject(FormBuilder);

  newChatForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duplicateError']?.currentValue) {
      this.nameControl?.setErrors({ duplicate: true });
      this.nameControl?.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.newChatForm.invalid) {
      this.newChatForm.markAllAsTouched();
      return;
    }

    const name = this.newChatForm.value.name.trim();

    if (!name) return;

    this.chatCreated.emit(name);
  }

  get nameControl() {
    return this.newChatForm.get('name');
  }
}