import { Validators } from '@angular/forms';

export const FormValidators = {
  username: [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9_]{3,20}$/),
    Validators.minLength(3),
    Validators.maxLength(20),
  ],
  password: [
    Validators.required,
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/),
    Validators.minLength(6),
    Validators.maxLength(50),
  ],
  email: [Validators.required, Validators.email, Validators.maxLength(100)],
} as const;
