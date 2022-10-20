import React, { useEffect, useRef } from 'react'
import { Command, EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, NodeType, NodeSpec, Node } from 'prosemirror-model'
import { schema } from './prosemirror/schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from './prosemirror/setup'
import applyDevTools from 'prosemirror-dev-tools'

import './App.css'
import './Prosemirror.css'

function insertNode(node: Node): Command {
  return function (state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    let { $from } = state.selection,
      index = $from.index()
    // if (!$from.parent.canReplaceWith(index, index, node)) return false
    if (dispatch) dispatch(state.tr.replaceSelectionWith(node))
    return true
  }
}

function App() {
  const viewRef = useRef<EditorView>()
  const schemaRef = useRef<Schema>()
  useEffect(() => {
    if (viewRef.current) return //FIXME: https://github.com/facebook/react/issues/24502

    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    })

    const view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content')!),
        plugins: exampleSetup({ schema: mySchema }),
      }),
    })
    viewRef.current = view
    schemaRef.current = mySchema
    applyDevTools(view)
  }, [])

  function testButtonClick() {
    const editorView = viewRef.current!
    const schema = schemaRef.current!
    const { state, dispatch } = editorView

    const node: Node = schema.nodes.heading.create({ level: 1 })

    insertNode(node)(state, dispatch)
    editorView.focus()
  }

  return (
    <div className='App'>
      <button style={{ marginTop: 16 }} onClick={testButtonClick}>
        test
      </button>
      <div style={{ padding: 16 }}>
        <div id='editor'></div>
        <div id='content'></div>
      </div>
    </div>
  )
}

export default App
