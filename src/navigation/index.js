import React from 'react'

import { NativeBaseProvider, extendTheme } from 'native-base';

import {AuthenticatedUserProvider} from './AuthenticatedUserProvider'
import RootNavigator from './RootNavigator'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../redux/reducers/index'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

export default function Routes() {
	const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#fff',
        100: '#E8BD70',
        200: '#121212',
      },
    },
    config: { 
      initialColorMode: 'dark',
    },
  });
	return (
		<NativeBaseProvider theme={theme}>
			<Provider store={store}>
				<AuthenticatedUserProvider>
					<RootNavigator />
				</AuthenticatedUserProvider>
			</Provider>
		</NativeBaseProvider>
	)
}
