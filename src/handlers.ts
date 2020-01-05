import * as vscode from 'vscode';
import * as jsYaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs';

type Layout = { "windows": Array<Layout.Window>, };

namespace Layout {
  export type Window = { "panes": Array<Layout.PaneCommand> };
  export type PaneCommand = string;
}

/**
 * @todo better way to deal with the validations
 * (something like guard checks maybe?)
 * @todo support other `window` attributes
 */
const up = async (): Promise<void> => {
  // @todo there's a better way to narrow this after the check below?
  const rootPath = vscode.workspace.rootPath as string;
  if (!rootPath) { vscode.window.showErrorMessage("No workspace opened!"); return }

  // @todo there's a better way to narrow this after the check below?
  const layoutPath = await vscode.window.showInputBox({
    prompt: "Path to itermocil's yaml (relative to workspace root)",
    value: ".project/itermocil.yml",
  }) as string;
  if (!layoutPath) { vscode.window.showErrorMessage("No layout file given!"); return }

  const fullLayoutPath = path.join(rootPath, layoutPath);
  if (!fs.existsSync(fullLayoutPath)) { vscode.window.showErrorMessage("File does not exist"); return }

  const layoutContent = fs.readFileSync(fullLayoutPath).toString();
  const parsedLayout: Layout = jsYaml.safeLoad(layoutContent);

  /**
   * we create a new terminal window for each `pane`
   * because of https://github.com/microsoft/vscode/issues/45407
   */
  parsedLayout.windows.forEach((window: Layout.Window) => {
    window.panes.forEach((pane: Layout.PaneCommand) => {
      /**
       * @todo support pane object structure
       * (e.g. `root` and `focus` attributes)
       */
      const layoutPaneTerminal = vscode.window.createTerminal()
      // actually run the command instead of just "typing"
      const addsNewLine = true;

      layoutPaneTerminal.sendText(pane, addsNewLine)
    })
  })
}

export default { up }