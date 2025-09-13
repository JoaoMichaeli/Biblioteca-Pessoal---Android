export type UnsafeStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type SafeStackParamList = {
  Dashboard: undefined;
  Home: undefined;
  BookList: undefined;
  CreateBook: undefined;
  EditBook: { bookId: string };
  BookDetails: { book: Book };
  Profile: undefined;
};