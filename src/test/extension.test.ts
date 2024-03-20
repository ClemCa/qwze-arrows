import * as assert from 'assert';
import { suite } from 'mocha'; // Import the 'suite' function from the 'mocha' module

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Toggle feature test', async () => {
		const enabled = vscode.workspace.getConfiguration('qwze-arrows').get('enabled');

		await vscode.commands.executeCommand('qwze-arrows.toggle');
		assert.notStrictEqual(enabled, vscode.workspace.getConfiguration('qwze-arrows').get('enabled'));

		await vscode.commands.executeCommand('qwze-arrows.toggle');
		assert.strictEqual(enabled, vscode.workspace.getConfiguration('qwze-arrows').get('enabled'));
	});

	test('W-only toggle test', async () => {
		const wOnly = vscode.workspace.getConfiguration('qwze-arrows').get('wOnly');

		await vscode.commands.executeCommand('qwze-arrows.wOnlyToggle');
		assert.strictEqual(wOnly, vscode.workspace.getConfiguration('qwze-arrows').get('wOnly'));

		await vscode.commands.executeCommand('qwze-arrows.wOnlyToggle');
		assert.strictEqual(wOnly, vscode.workspace.getConfiguration('qwze-arrows').get('wOnly'));
	});

	test('Arrow insertion test', async () => {
		await vscode.workspace.getConfiguration('qwze-arrows').update('enabled', true, true);
		await vscode.workspace.getConfiguration('qwze-arrows').update('wOnly', false, true);

		const testDocument = await vscode.workspace.openTextDocument({ content: 'xx', language: 'plaintext' });
		const testEditor = await vscode.window.showTextDocument(testDocument);

		const position = new vscode.Position(0, 0);
		testEditor.selection = new vscode.Selection(position, position);

		// base x test
		await testEditor.edit(editBuilder => {
			editBuilder.insert(position, 'x');
		});
		assert.strictEqual(testEditor.document.getText(), 'x>');

		// base w test
		await testEditor.edit(editBuilder => {
			editBuilder.insert(position, 'w');
		});
		await testEditor.edit(editBuilder => {
			editBuilder.insert(position, 'w');
		});
		assert.strictEqual(testEditor.document.getText(), 'x><');

		// wOnly test
		await vscode.workspace.getConfiguration('qwze-arrows').update('wOnly', true, true);
		await testEditor.edit(editBuilder => {
			editBuilder.insert(position, 'W');
		});
		await testEditor.edit(editBuilder => {
			editBuilder.insert(position, 'W');
		});
		assert.strictEqual(testEditor.document.getText(), 'x><>');
	});
});