export class File {
  constructor(
    public name: string,
    public type: string,
    public contents: string | File[]
  ) {}
}
