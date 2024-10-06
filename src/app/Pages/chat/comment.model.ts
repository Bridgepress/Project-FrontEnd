export class Comment {
    constructor(
        public id: number,
        public content: string,
        public left: number,
        public right: number,
        public parentId: number | null,
        public user: {
            id: number,
            userName: string,
            email: string
        },
        public imageBase64: string | null,
        public textFileBase64: string | null,
        public replies?: Comment[]
    ){}
  }