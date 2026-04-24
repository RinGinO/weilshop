import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, {
    message: 'Имя должно содержать только буквы, пробелы и дефисы',
  })
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, {
    message: 'Фамилия должна содержать только буквы, пробелы и дефисы',
  })
  lastName: string;

  @IsEmail({}, { message: 'Некорректный email' })
  @IsOptional()
  email?: string;

  @IsString()
  @Matches(/^\+?[0-9\s\-()]+$/, {
    message: 'Некорректный номер телефона',
  })
  @MinLength(10)
  @MaxLength(20)
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру',
  })
  password: string;
}

export class LoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  login: string; // email или телефон

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @MinLength(1)
  refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(1)
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру',
  })
  password: string;
}

export class ConfirmEmailDto {
  @IsString()
  @MinLength(1)
  token: string;
}
