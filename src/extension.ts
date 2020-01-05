import * as vscode from 'vscode';
import handlers from './handlers';

/**
 * @todo Show a sidebar with vscodecil terminals?
 * @todo how to deal with exists in a graceful way?
 *   - exit terminals in reverse up order?
 *	 - if not, possible issues: zookeeper and kafka exit order and zombie processes
 */
export function activate(context: vscode.ExtensionContext) {
	[
		vscode.commands.registerCommand('vscodecil.up', handlers.up),
	].forEach(
		(command: vscode.Disposable) =>
			context.subscriptions.push(command)
	)
}

export function deactivate() { }
