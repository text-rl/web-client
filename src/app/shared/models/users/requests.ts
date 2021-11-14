export interface LoginUserQuery {
  password: string;
  email: string;
}

export interface RegisterUserCommand {
  password: string;
  email: string;
  username: string;
}


