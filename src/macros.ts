import * as vscode from 'vscode'
import { EXT_PREFIX, readConfig } from './config'

const disposables: vscode.Disposable[] = []
const CONFIG = `${EXT_PREFIX}.macros`

interface Action {
  command?: string
  args?: Object
}

let macrosConfig: vscode.WorkspaceConfiguration | null = null
let _macrosList: string[] | null = null

function macrosList(): string[] {
  if (!macrosConfig) {
    return []
  }
  if (!_macrosList) {
    const ignores = ['has', 'get', 'update', 'inspect']
    _macrosList = Object.keys(macrosConfig).filter(
      (name) => ignores.indexOf(name) < 0
    )
  }

  return _macrosList
}

function executeCommand(action: Action | string): Thenable<any> {
  if (!action) {
    vscode.window.showErrorMessage(`Invalid action. ${action}`)
    return Promise.resolve()
  }
  if (action instanceof Object) {
    const command = action.command
    const args = action.args
    if (!command) {
      vscode.window.showErrorMessage('No command in macro action')
      return Promise.resolve()
    }
    return vscode.commands.executeCommand(command, args)
  } else {
    return vscode.commands.executeCommand(action)
  }
}

function disposeMacros() {
  const toDisposeList = disposables.splice(0, disposables.length)
  toDisposeList.forEach((disposable) => disposable.dispose())
}

function reloadMacros() {
  disposeMacros()

  _macrosList = null
  macrosConfig = readConfig(CONFIG)
  if (!macrosConfig) {
    return
  }
  macrosList().forEach((name) => {
    const actions = macrosConfig!![name]
    disposables.push(
      vscode.commands.registerCommand(`${CONFIG}.${name}`, () => {
        actions.reduce(
          async (promise: Promise<undefined>, action: Action | string) => {
            await promise
            await executeCommand(action)
          },
          Promise.resolve()
        )
      })
    )
  })
  vscode.window.showInformationMessage(
    `macros reloaded. ${JSON.stringify(macrosList())}`
  )
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  reloadMacros()

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG)) {
        reloadMacros()
      }
    })
  )
}

// This method is called when your extension is deactivated
export function deactivate() {
  disposeMacros()
}
