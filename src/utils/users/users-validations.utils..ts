import { UnprocessableEntityException } from '@nestjs/common';
import { error } from 'console';

// Check if the email is in valid format
export function isEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Check if the password is in valid format (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
export function isPassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Check if the name is in valid format (1-20 characters long, only letters, spaces, or hyphens)
export function isName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s-]{3,20}$/;
  return nameRegex.test(name);
}

export interface UserData {
  email: string;
  password: string;
  name: string;
}

// Validate user data (email, password, name)
export function validateData(data: UserData): string[] {
  const errors = [];

  if (!isEmail(data.email)) {
    errors.push('Invalid email format');
  }
  if (!isPassword(data.password)) {
    errors.push(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
    );
  }
  if (!isName(data.name)) {
    errors.push(
      'Name must be 1-50 characters long and contain only letters, spaces, or hyphens',
    );
  }

  if (errors.length > 0) {
    throw new UnprocessableEntityException(errors);
  }

  return;
}
