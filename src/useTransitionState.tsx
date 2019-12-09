import { useState, useEffect } from 'react'
import { of } from 'rxjs'
import { delay, concatMap } from 'rxjs/operators'

export enum State {
	BEFORE_ENTER = 'BEFORE_ENTER',
	ENTER = 'ENTER',
	AFTER_ENTER = 'AFTER_ENTER',
	BEFORE_LEAVE = 'BEFORE_LEAVE',
	LEAVE = 'LEAVE',
	AFTER_LEAVE = 'AFTER_LEAVE',
}

const makeLabels = (type: 'ENTER' | 'LEAVE') => {
	switch (type) {
		case 'ENTER':
			return {
				before: State.BEFORE_ENTER,
				pending: State.ENTER,
				after: State.AFTER_ENTER,
			}
		case 'LEAVE':
			return {
				before: State.BEFORE_LEAVE,
				pending: State.LEAVE,
				after: State.AFTER_LEAVE,
			}
		default:
			throw new Error('wtf')
	}
}

const makeObservable = (type: 'ENTER' | 'LEAVE', delayTime: number) => {
	const label = makeLabels(type)
	return of(label.before, label.pending, label.after).pipe(
		concatMap(l => (label.after === l ? of(l).pipe(delay(delayTime)) : of(l))),
	)
}

export type Props = {
	show: boolean
	delay: number
}

export const useTransitionState = ({ show, delay }: Props) => {
	const [state, setState] = useState<State>(State.BEFORE_ENTER)
	useEffect(() => {
		const type = show ? 'ENTER' : 'LEAVE'
		const sub = makeObservable(type, delay).subscribe(setState)
		return () => sub.unsubscribe()
	}, [show, delay])
	return state
}
