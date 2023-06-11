type StatusRequest = Readonly<{
  description: string;
}>;

export const BAD_REQUEST: StatusRequest = {
  description: 'Bad Request.',
};

export const FORBIDDEN: StatusRequest = {
  description: 'Forbidden.',
};

export const NOT_FOUND: StatusRequest = {
  description: 'Not Found.',
};
