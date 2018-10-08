import { MonacoFile } from 'ngx-monaco';

export class File {
  constructor(
    public name: string,
    public type: string,
    public contents?: File[],
    public storageRef?: string,
    public monacoFile?: Promise<MonacoFile>
  ) {}
}
