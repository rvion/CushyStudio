export type TypeImportLocation =
   /**
    * when you want to import stuff for a typescript module
    * works with both type-level stuff, and value-level stuff
    */
   | { type: 'module'; relPath: string }
   /**
    * when you want to import stuff for a global namespace module
    * works with both type-level stuff, and value-level stuff
    */
   | { type: 'globalNamespace'; namespaceName: string }
