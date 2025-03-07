import React from "react";
import {
	StyleSheet,
	ScrollView,
	TouchableHighlight,
	Animated,
	Dimensions,
	PanResponder,
	Easing,
	TouchableWithoutFeedback
} from "react-native";
import { Bar } from "./Bar";
import { Close } from "./Close";

import PropTypes from "prop-types";

const FULL_HEIGHT = Dimensions.get("window").height;
const FULL_WIDTH = Dimensions.get("window").width;
const CONTAINER_HEIGHT = FULL_HEIGHT - 50;

const SMALL_HEIGHT = FULL_HEIGHT - 300;
const MEDIUM_HEIGHT = FULL_HEIGHT - FULL_HEIGHT * 0.18;
const LARGE_HEIGHT = FULL_HEIGHT - 100;

export default class SwipeablePanel extends React.Component {
	static propTypes = {
		isActive: PropTypes.bool.isRequired,
		onClose: PropTypes.func,
		fullWidth: PropTypes.bool,
		onPressCloseButton: PropTypes.func,
		noBackgroundOpacity: PropTypes.bool,
		largeHeight: PropTypes.number,
		smallHeight: PropTypes.number,
		smallState: PropTypes.bool,
		onSmall: PropTypes.func,
		onLarge: PropTypes.func,
		showBar: PropTypes.bool,
		onBack: PropTypes.func,
		onNext: PropTypes.func,
		caption: PropTypes.string
	};

	get largeHeight() {
		if (this.props.largeHeight > 0) {
			if (FULL_HEIGHT > this.props.largeHeight) {
				return FULL_HEIGHT - this.props.largeHeight;
			}
			return FULL_HEIGHT - CONTAINER_HEIGHT;
		}
		return FULL_HEIGHT - LARGE_HEIGHT;
	}

	get smallHeight() {
		if (this.props.smallHeight > 0) {
			return FULL_HEIGHT - this.props.smallHeight;
		}
		return SMALL_HEIGHT;
	}

	get status() {
		return this.state.status;
	}

	constructor(props) {
		super(props);
		this.state = {
			showComponent: false,
			opacity: new Animated.Value(0),
			canScroll: false,
			status: 0 // {0: close, 1: small, 2: large}
		};
		this.pan = new Animated.ValueXY({ x: 0, y: FULL_HEIGHT });
		this.oldPan = { x: 0, y: 0 };

		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onPanResponderGrant: (evt, gestureState) => {
				if (this.state.status == 1)
					this.pan.setOffset({ x: this.pan.x._value, y: this.smallHeight });
				else if (this.state.status == 2)
					this.pan.setOffset({ x: this.pan.x._value, y: this.largeHeight });
				this.pan.setValue({ x: 0, y: 0 });
			},
			onPanResponderMove: (evt, gestureState) => {
				const currentTop = this.pan.y._offset + gestureState.dy;
				if (this.pan.y._value < 0 && this.pan.y._offset === this.largeHeight);
				else if (currentTop > 0)
					this.pan.setValue({ x: 0, y: gestureState.dy });
			},
			onPanResponderRelease: (evt, { vx, vy }) => {
				this.pan.flattenOffset();

				const distance = this.oldPan.y - this.pan.y._value;
				const absDistance = Math.abs(distance);

				if (this.state.status == 2) {
					if (0 < absDistance && absDistance < 100) this._animateToLargePanel();
					else if (100 < absDistance && absDistance < CONTAINER_HEIGHT - 200) {
						if (this.props.smallState === false) {
							this._animateClosingAndOnCloseProp();
						} else {
							this._animateToSmallPanel();
						}
					} else if (CONTAINER_HEIGHT - 200 < absDistance)
						this._animateClosingAndOnCloseProp();
				} else {
					if (distance < -100) this._animateClosingAndOnCloseProp(false);
					else if (distance > 0 && distance > 50) this._animateToLargePanel();
					else this._animateToSmallPanel();
				}
			}
		});
	}

	componentDidMount = () => { };

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isActive != this.props.isActive) {
			if (this.props.isActive) {
				if (this.props.openLarge) this.openLarge();
				else this.openDetails();
			} else this.closeDetails(true);
		}
	}

	_animateClosingAndOnCloseProp = isCloseButtonPress => {
		this.closeDetails(isCloseButtonPress);
	};

	_animateToLargePanel = () => {
		Animated.spring(this.pan, {
			toValue: { x: 0, y: this.largeHeight },
			easing: Easing.bezier(0.05, 1.35, 0.2, 0.95),
			duration: 200,
			useNativeDriver: true
		}).start();
		this.setState({ canScroll: true, status: 2 });
		this.props.onLarge && this.props.onLarge();
		this.oldPan = { x: 0, y: this.largeHeight };
	};

	_animateToSmallPanel = () => {
		Animated.spring(this.pan, {
			toValue: { x: 0, y: this.smallHeight },
			easing: Easing.bezier(0.05, 1.35, 0.2, 0.95),
			duration: 300,
			useNativeDriver: true
		}).start();
		this.setState({ status: 1 });
		this.props.onSmall && this.props.onSmall();
		this.oldPan = { x: 0, y: this.smallHeight };
	};

	openLarge = async () => {
		await this.setState({ showComponent: true, status: 2, canScroll: true });
		Animated.parallel([
			Animated.timing(this.pan, {
				toValue: { x: 0, y: this.largeHeight },
				easing: Easing.bezier(0.05, 1.35, 0.2, 0.95),
				duration: 500,
				useNativeDriver: true
			}).start(),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				easing: Easing.bezier(0.5, 0.5, 0.5, 0.5),
				duration: 300,
				useNativeDriver: true
			}).start()
		]);
		this.oldPan = { x: 0, y: this.largeHeight };
	};

	openDetails = () => {
		this.setState({ showComponent: true, status: 1 });
		Animated.parallel([
			Animated.timing(this.pan, {
				toValue: { x: 0, y: this.smallHeight },
				easing: Easing.bezier(0.05, 1.35, 0.2, 0.95),
				duration: 500,
				useNativeDriver: true
			}).start(),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				easing: Easing.bezier(0.5, 0.5, 0.5, 0.5),
				duration: 300,
				useNativeDriver: true
			}).start()
		]);
		this.oldPan = { x: 0, y: this.smallHeight };
	};

	closeDetails = isCloseButtonPress => {
		Animated.parallel([
			Animated.timing(this.pan, {
				toValue: { x: 0, y: FULL_HEIGHT },
				easing: isCloseButtonPress
					? Easing.bezier(0.98, -0.11, 0.44, 0.59)
					: Easing.linear,
				duration: this.state.status == 2 ? 500 : 300,
				useNativeDriver: true
			}).start(),
			Animated.timing(this.state.opacity, {
				toValue: this.state.status == 1 ? 0 : 1,
				easing: Easing.bezier(0.5, 0.5, 0.5, 0.5),
				duration: this.state.status == 2 ? 500 : 300,
				useNativeDriver: true
			}).start()
		]);

		setTimeout(
			() => {
				this.setState({ showComponent: false, canScroll: false, status: 0 });
				if (this.props.onClose != "undefined" && this.props.onClose)
					this.props.onClose();
			},
			this.state.status == 2 ? 450 : 250
		);
	};

	hideDetails = () => {
		Animated.parallel([
			Animated.timing(this.pan, {
				toValue: { x: 0, y: FULL_HEIGHT },
				easing: Easing.linear,
				duration: this.state.status == 2 ? 500 : 300,
				useNativeDriver: true
			}).start()
		]);

		setTimeout(
			() => {
				this.setState({ showComponent: true, canScroll: false, status: 0 });
			},
			this.state.status == 2 ? 450 : 250
		);
	};

	onPressCloseButton = () => {
		this._animateClosingAndOnCloseProp(true);
	};

	render() {
		const { showComponent, opacity } = this.state;
		const {
			noBackgroundOpacity,
			onBackdropPress,
			useNativeDriver
		} = this.props;

		return showComponent ? (
			<Animated.View
				style={[
					SwipeablePanelStyles.background,
					{
						opacity,
						backgroundColor: noBackgroundOpacity
							? "rgba(0,0,0,0)"
							: "rgba(0,0,0,0.5)"
					}
				]}
			>
				{!this.props.background && (
					<TouchableWithoutFeedback onPress={onBackdropPress}>
						<Animated.View
							ref={ref => (this.backdropRef = ref)}
							useNativeDriver={useNativeDriver}
							style={[SwipeablePanelStyles.background]}
						>
							{this.props.background}
						</Animated.View>
					</TouchableWithoutFeedback>
				)}
				{this.props.background}
				<Animated.View
					style={[
						SwipeablePanelStyles.container,
						{ width: this.props.fullWidth ? FULL_WIDTH : FULL_WIDTH - 50 },
						{ transform: this.pan.getTranslateTransform() }
					]}
					{...this._panResponder.panHandlers}
				>
					<Bar />
					<ScrollView
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={SwipeablePanelStyles.scroll}
						style={{ flex: 1 }}
					>
						{this.state.canScroll ? (
							<TouchableHighlight>
								<React.Fragment>{this.props.children}</React.Fragment>
							</TouchableHighlight>
						) : (
								this.props.children
							)}
					</ScrollView>
					{this.props.onBack && (
						<Close
							largeHeight={this.props.largeHeight}
							onBack={this.props.onBack}
							onNext={this.props.onNext}
							caption={this.props.caption}
							actionColor={this.props.actionColor}
						/>
					)}
				</Animated.View>
			</Animated.View>
		) : null;
	}
}

const SwipeablePanelStyles = StyleSheet.create({
	background: {
		position: "absolute",
		zIndex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: FULL_WIDTH,
		height: FULL_HEIGHT
	},
	container: {
		position: "absolute",
		height: CONTAINER_HEIGHT,
		width: FULL_WIDTH - 50,
		transform: [{ translateY: FULL_HEIGHT - 100 }],
		display: "flex",
		flexDirection: "column",
		bottom: 0,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.18,
		shadowRadius: 1.0,
		elevation: 1,
		zIndex: 2
	},
	scroll: {
		width: "100%",
		backgroundColor: "white",
		flexGrow: 1,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24
	}
});
