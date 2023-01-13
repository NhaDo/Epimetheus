import React, { useState, useEffect, useRef} from 'react';
import OutputScreen from './Services.js';
import Home from './Home.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from './List.js';

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={Home} options={{title:"Take a pic"}}/>
				<Stack.Screen name="OutputScreen" component={OutputScreen}/>
				<Stack.Screen name="ListScreen" component={ListScreen}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};