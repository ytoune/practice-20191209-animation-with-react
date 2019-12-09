import React from 'react'
import styled from 'styled-components'
import { useTransitionState } from './useTransitionState'

export type Props = {
	show: boolean
	delay?: number
}

const Div = styled.div<{ delay: number }>`
	&.BEFORE_ENTER,
	&.LEAVE,
	&.AFTER_LEAVE {
		opacity: 0;
	}
	&.ENTER,
	&.LEAVE {
		transition: all ${p => p.delay / 1000}s ease-in-out 0s;
	}
	&.ENTER,
	&.AFTER_ENTER,
	&.BEFORE_LEAVE {
		opacity: 1;
	}
`

export const FadeBox: React.FC<Props> = ({ show, delay = 200, children }) => (
	<Div delay={delay} className={useTransitionState({ show, delay })}>
		{children}
	</Div>
)
