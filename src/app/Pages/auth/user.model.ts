export class User{
    constructor(
        public id :string, 
        public userName: string, 
        public accessToken: string, 
        public refreshToken: string){}
  }