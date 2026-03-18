import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FormComponent {
  @Output() loginSubmitted = new EventEmitter<{ name: string; email: string }>();

  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginSubmitted.emit({
      name: this.loginForm.value.name.trim(),
      email: this.loginForm.value.email.trim().toLowerCase(),
    });

    this.loginForm.reset();
  }

  get nameControl() {
    return this.loginForm.get('name');
  }

  get emailControl() {
    return this.loginForm.get('email');
  }
}