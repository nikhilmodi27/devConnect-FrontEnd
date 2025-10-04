export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  age?: number;
  gender: string;
  about?: string;
}