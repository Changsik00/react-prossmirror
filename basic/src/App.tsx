import React, { useEffect, useRef } from 'react'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from './prosemirror/schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from './prosemirror/setup'
import applyDevTools from 'prosemirror-dev-tools'

import './App.css'
import './Prosemirror.css'

function App() {
  const viewRef = useRef<EditorView>()
  useEffect(() => {
    if (viewRef.current) return //FIXME: https://github.com/facebook/react/issues/24502

    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    })

    const view = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content') as Node),
        plugins: exampleSetup({ schema: mySchema }),
      }),
    })
    viewRef.current = view
    applyDevTools(view)
  }, [])

  function testButtonClick() {
    viewRef?.current?.focus()
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
