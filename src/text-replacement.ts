import * as vscode from 'vscode'
import { TextEditor, TextEditorEdit } from 'vscode'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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
