import React, { useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from './prosemirror/schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from './prosemirror/setup'

import './App.css'
import './Prosemirror.css'

function App() {
  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    })

    const editor = new EditorView(document.querySelector('#editor'), {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content') as Node),
        plugins: exampleSetup({ schema: mySchema }),
      }),
    })
  }, [])

  return (
    <div className='App'>
      <div style={{ padding: 16 }}>
        <div id='editor'></div>
        <div id='content'></div>
      </div>
    </div>
  )
}

export default App
