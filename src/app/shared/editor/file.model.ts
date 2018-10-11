export class File {
  constructor(
    public name: string,
    public type: string,
    public contents?: File[] | string,
    public initialContent?: string,
    public path?: string
  ) {}
}
