export class StringExt extends String{
  // Replace all occurrences of a substring in a string
  public static replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(find, 'g'), replace);
  }
}

