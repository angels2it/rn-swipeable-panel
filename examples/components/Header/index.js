import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const Header = ({ title = null }) => (
	<View style={HeaderStyles.container}>
		<View style={HeaderStyles.innerContent}>
			<Text style={HeaderStyles.title}>{title}</Text>
		</View>
	</View>
);

const HeaderStyles = StyleSheet.create({
	container: {
		width: '100%',
		height: 'auto',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: 50
	},
	innerContent: {
		width: '90%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		position: 'relative'
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		marginBottom: 5
	}
});
