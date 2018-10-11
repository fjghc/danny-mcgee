export class File {
  constructor(
    public name: string,
    public type: string,
    public contents?: File[] | Promise<string>,
    public initialContent?: string | Promise<string>,
    public path?: string
  ) {}
}
