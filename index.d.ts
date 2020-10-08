type Variables = { [k: string]: any }
type Callback = (error: Error | null,
                  createdFiles: string[] | undefined) => any

/**
 * Copy a directory of files over to the target directory, and inject the
 * files with variables.
 *
 * @param srcDir The directory that holds the templates. Filenames prepended
 *               with a `_` will have it removed when copying. Dotfiles need
 *               to be prepended with a `_`. Files and filenames are
 *               populated with variables using the {{varName}} syntax
 * @param outDir The output directory
 * @param vars An object with variables that are injected into the template
 *             files and file names
 * @param cb A callback that is called on completion, with paths to created
 *           files if there were no errors
 */
declare function copyTemplateDir(srcDir: string, outDir: string,
                          vars: Variables, cb: Callback)

/**
 * Copy a directory of files over to the target directory, and inject the
 * files with variables.
 *
 * @param srcDir The directory that holds the templates. Filenames prepended
 *               with a `_` will have it removed when copying. Dotfiles need
 *               to be prepended with a `_`. Files and filenames are
 *               populated with variables using the {{varName}} syntax
 * @param outDir The output directory
 * @param cb A callback that is called on completion, with paths to created
 *           files if there were no errors
 */
declare function copyTemplateDir(srcDir: string, outDir: string, cb: Callback)

/**
 * Copy a directory of files over to the target directory, and inject the
 * files with variables.
 *
 * @param srcDir The directory that holds the templates. Filenames prepended
 *               with a `_` will have it removed when copying. Dotfiles need
 *               to be prepended with a `_`. Files and filenames are
 *               populated with variables using the {{varName}} syntax
 * @param outDir The output directory
 */
declare function copyTemplateDir(srcDir: string, outDir: string)

export = copyTemplateDir