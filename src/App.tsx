import React, { useState, useCallback } from 'react'
import { FadeBox } from './FadeBox'

export const App = () => {
	const [show, setShow] = useState(true)
	const toggle = useCallback(() => setShow(!show), [show, setShow])
	return (
		<div>
			<p>
				<button onClick={toggle}>toggle: {show ? 'on' : 'off'}</button>
			</p>
			<FadeBox show={show} delay={500}>
				hogehoge
			</FadeBox>
		</div>
	)
}
