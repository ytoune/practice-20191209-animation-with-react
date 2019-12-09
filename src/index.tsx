import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

const main = async () => {
	const el = document.querySelector('main')
	el && render(<App />, el)
}

main().catch(x => {
	console.log('# something happens.')
	console.error(x)
	if ('undefined' === typeof process) return
	process.exit(1)
})
