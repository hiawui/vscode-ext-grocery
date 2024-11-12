# hiawui.grocery README

My vscode extension grocery

## Features

### Commands

**hiawui.grocery.replace**: Text replacement

```typescript
// arguments
{
    pattern: string,
    replacement: string,
    regex: boolean | undefined
}
```

### Macros Configuration

Below settings add two commands:

1. **_hiawui.grocery.macros.simple_**: Move cursor to line end and insert a line break
2. **_hiawui.grocery.macros.complex_**: Format the document and replace all tabs to spaces

```json
// settings.json
{
  "hiawui.grocery.macros": {
    "simple": ["cursorEnd", "lineBreakInsert"],
    "complex": [
      "editor.action.formatDocument",
      {
        "command": "hiawui.grocery.replace",
        "args": {
          "pattern": "\t",
          "replacement": "....",
          "regex": true
        }
      }
    ]
  }
}
```
