import { Validators } from '@angular/forms';

export const AuthInputValidators = {
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
};

export const PostInputValidators = {
  title: [
    Validators.required,
    Validators.pattern(/^[\w\s-]{1,255}$/),
    Validators.minLength(1),
    Validators.maxLength(255),
  ],
  content: [
    Validators.required,
    Validators.pattern(/^[\s\S]{1,5000}$/),
    Validators.minLength(1),
    Validators.maxLength(5000),
  ],
};

export const CommentInputValidators = {
  comment: [
    Validators.required,
    Validators.pattern(/^[\s\S]{1,1000}$/),
    Validators.minLength(1),
    Validators.maxLength(1000),
  ],
};

export const CategoryInputValidators = {
  name: [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(100),
  ],
  description: [Validators.maxLength(500)],
};

export const TagInputValidators = {
  name: [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(50),
  ],
  description: [Validators.maxLength(500)],
};
