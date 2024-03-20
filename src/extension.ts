/* eslint-disable curly */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let toggleCommand = vscode.commands.registerCommand('qwze-arrows.toggle', () => {
		if(vscode.workspace.getConfiguration('qwze-arrows').get('enabled')) {
			vscode.workspace.getConfiguration('qwze-arrows').update('enabled', false, true);
			vscode.window.showInformationMessage('Arrows insertion disabled!');
			return;
		}
		vscode.workspace.getConfiguration('qwze-arrows').update('enabled', true, true);
		vscode.window.showInformationMessage('Arrows insertion enabled!');
	});

	context.subscriptions.push(toggleCommand);

	vscode.workspace.onDidChangeTextDocument(arrowDetection);
}

function arrowDetection(change: vscode.TextDocumentChangeEvent) {
	if(change.reason !== undefined) return;
	if(!vscode.workspace.getConfiguration('qwze-arrows').get('enabled')) return;
	const wOnly = vscode.workspace.getConfiguration('qwze-arrows').get('wOnly');
	function Check(text: string) {
		if(text.length < 2) return;
		if(text[text.length-1] === 'w' && text[text.length-2] === 'w') arrowInsertion('<');
		if(wOnly){
			if(text[text.length-1] === 'W' && text[text.length-2] === 'W') arrowInsertion('>');
		}
		else if(text[text.length-1] === 'x' && text[text.length-2] === 'x') arrowInsertion('>');
	}
	if(change.contentChanges.length === 0) return;
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	const cursor = editor.selection.active;
	const changedBefore = editor.document.lineAt(cursor.line).text.slice(cursor.character-1, cursor.character);
	const changedAfter = change.contentChanges[change.contentChanges.length-1].text;
	// vscode gives us the last key pressed, and does not update the cursor position
	const changedText = changedBefore + changedAfter;
	Check(changedText);
}

function arrowInsertion(arrow: '<' | '>') {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	editor.edit(editBuilder => {
		const cursor = editor.selection.active;
		editBuilder.replace(new vscode.Range(cursor.line, cursor.character - 1, cursor.line, cursor.character+1), arrow);
	}, {undoStopBefore: true, undoStopAfter: true});
	editor.selection.active = new vscode.Position(editor.selection.active.line, editor.selection.active.character-1);
}

export function deactivate() {}
