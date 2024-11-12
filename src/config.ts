import * as vscode from 'vscode'
import { publisher as extPublisher, name as extName } from '../package.json'

export const EXT_PREFIX = `${extPublisher}.${extName}`

export function readConfig(path: string): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(path)
}
