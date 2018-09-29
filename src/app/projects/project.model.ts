import { File } from './file.model';

export class Project {
  constructor(
    public name: string,
    public url: string,
    public source: File[]
  ) {}
}
