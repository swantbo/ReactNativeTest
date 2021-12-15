import React from 'react'

import {AuthenticatedUserProvider} from './AuthenticatedUserProvider'
import RootNavigator from './RootNavigator'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../redux/reducers/index'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

export default function Routes() {
	return (
		<Provider store={store}>
			<AuthenticatedUserProvider>
				<RootNavigator />
			</AuthenticatedUserProvider>
		</Provider>
	)
}
