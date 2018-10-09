export class File {
  constructor(
    public name: string,
    public type: string,
    public contents?: File[] | Promise<string>,
    public storageRef?: string
  ) {}
}
