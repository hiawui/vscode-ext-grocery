// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { TextEditor, TextEditorEdit } from 'vscode'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "hiawui.grocery" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerTextEditorCommand(
    'hiawui.grocery.replace',
    (
      textEditor: TextEditor,
      edit: TextEditorEdit,
      args:
        | { pattern: string; replacement: string; regex: boolean | undefined }
        | undefined
    ) => {
      if (!args) {
        vscode.commands.executeCommand('editor.actions.findWithArgs', {
          searchString: '',
          replaceString: '',
        })
      } else {
        if (!args.pattern) {
          return
        }
        let p: string | RegExp = args.pattern
        if (args.regex) {
          p = new RegExp(args.pattern, 'gm')
        }
        const text = textEditor.document.getText()
        const startPos = textEditor.document.positionAt(0)
        const endPos = textEditor.document.positionAt(text.length)
        edit.replace(
          new vscode.Range(startPos, endPos),
          text.replaceAll(p, args.replacement)
        )
      }
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
