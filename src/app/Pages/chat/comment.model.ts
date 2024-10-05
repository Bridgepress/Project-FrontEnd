export class Comment {
    constructor(
        public id: number,
        public content: string,
        public left: number,
        public right: number,
        public parentId: number | null,
        public user: {
            id: number,
            userName: string
        }
    ){}
  }