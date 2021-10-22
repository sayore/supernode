export interface IPackageJSON {
    name: string;
    version: string;
    description: string;
    main: string;
    scripts: Scripts;
    keywords: any[];
    author: string;
    license: string;
    dependencies: Dependencies;
    devDependencies: DevDependencies;
    severencies: Severencies;
  }
  
  interface Severencies {
    test: number;
  }
  
  interface DevDependencies {
    '@types/fs-extra': string;
  }
  
  interface Dependencies {
    'discord.js': string;
    'fs-extra': string;
    typescript: string;
  }
  
  interface Scripts {
    test: string;
  }