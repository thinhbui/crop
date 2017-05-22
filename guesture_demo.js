import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    PanResponder,
    Image,
    ImageEditor,
    ImageCropData,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar
} from 'react-native';
// import FitImage from 'react-native-fit-image';
const window = Dimensions.get('window')
const heightDisplay = (Platform.OS === 'android' ? window.height - StatusBar.currentHeight : window.height);
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            initialTop: 170,
            initialLeft: window.width * .1,
            offsetTop: 0,
            offsetLeft: 0,
            dragging1: false,
            initialTop1: 365,
            initialLeft1: 350,
            offsetTop1: 0,
            offsetLeft1: 0,
            width: window.width * .8,
            height: 200,
            scale: 1,
            widthImage: 100,
            heightImage: 140,
            uri: 'file:///storage/emulated/0/Download/1482797.jpg'
        }
    }


    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderRelease: this.handlePanResponderEnd,
            onPanResponderTerminate: this.handlePanResponderEnd,
        })
        this.panResponder1 = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder1,
            onPanResponderGrant: this.handlePanResponderGrant1,
            onPanResponderMove: this.handlePanResponderMove1,
            onPanResponderRelease: this.handlePanResponderEnd1,
            onPanResponderTerminate: this.handlePanResponderEnd1,
        })
        console.log(heightDisplay, window.height)
        this.init()
    }
    init() {
        Image.getSize(this.state.uri, (width, height) => {
            this.setState({
                widthImage: width,
                heightImage: height,
                scale: width / height,
                initialTop: (heightDisplay - window.width / (width / height)) / 2 + window.width / (width / height) * .1,
                height: window.width / (width / height) * .8,
                initialTop1: (heightDisplay - window.width / (width / height)) / 2 + window.width / (width / height) * .1
                + window.width / (width / height) * .8 - 5,
                initialLeft1: this.state.initialLeft + this.state.width - 5
            });
        });
    }
    crop() {
        var widthRatio = window.width / this.state.widthImage;
        var heightRatio = window.width / this.state.scale / this.state.heightImage;
        let cropData = {
            offset: {
                x: this.state.initialLeft / widthRatio,
                y: (this.state.initialTop - (heightDisplay - window.width / this.state.scale) / 2) / heightRatio
            },
            size: {
                width: this.state.width / widthRatio,
                height: this.state.height / heightRatio
            },
        }
        ImageEditor.cropImage(
            this.state.uri,
            cropData,
            (uri) => {
                console.log(uri);
                this.setState({
                    uri: uri
                })
                Image.getSize(this.state.uri, (width, height) => {
                    this.setState({
                        widthImage: width,
                        heightImage: height,
                        scale: width / height
                    });
                }
                );
            },
            (failure) => {
                throw failure,
                console.log(failure)

            }
        )
    }

    panResponder = {}
    panResponder1 = {}


    // Should we become active when the user presses down on the square?
    handleStartShouldSetPanResponder = (e, gestureState) => {
        return true;
    }

    // We were granted responder status! Let's update the UI
    handlePanResponderGrant = (e, gestureState) => {
        this.setState({ dragging: true })
    }

    // Every time the touch/mouse moves
    handlePanResponderMove = (e, gestureState) => {
        const limTop = (heightDisplay - (window.width / this.state.scale)) / 2;
        const limBottom = limTop + window.width / this.state.scale;
        if (gestureState.dy + this.state.initialTop > limTop && gestureState.dy + this.state.initialTop + this.state.height < limBottom) {
            {
                this.setState({
                    offsetTop: gestureState.dy,
                    offsetTop1: gestureState.dy,
                })
            }
        }
        if (gestureState.dx + this.state.initialLeft > 0 && gestureState.dx + this.state.initialLeft + this.state.width < window.width) {
            {
                this.setState({
                    offsetLeft: gestureState.dx,
                    offsetLeft1: gestureState.dx,
                })
            }
        }

    }
    onShouldBlockNativeResponder = (e, gestureState) => {
        return true;
    }
    // When the touch/mouse is lifted
    handlePanResponderEnd = (e, gestureState) => {
        const { initialTop, initialLeft, initialTop1, initialLeft1, offsetTop, offsetLeft } = this.state

        // The drag is finished. Set the initialTop and initialLeft so that
        // the new position sticks. Reset offsetTop and offsetLeft for the next drag.
        this.setState({
            dragging: false,

            initialTop: initialTop + offsetTop,
            initialLeft: initialLeft + offsetLeft,

            initialTop1: initialTop1 + offsetTop,
            initialLeft1: initialLeft1 + offsetLeft,

            offsetTop: 0,
            offsetLeft: 0,
        })
    }

    handleStartShouldSetPanResponder1 = (e, gestureState) => {
        return true
    }

    // We were granted responder status! Let's update the UI
    handlePanResponderGrant1 = (e, gestureState) => {
        this.setState({ dragging1: true })
    }

    // Every time the touch/mouse moves
    handlePanResponderMove1 = (e, gestureState) => {
        const { initialTop1, initialLeft1, offsetLeft1, offsetTop1 } = this.state;
        const limTop = (heightDisplay - (window.width / this.state.scale)) / 2;
        const limBottom = limTop + window.width / this.state.scale;
        // Keep track of how far we've moved in total (dx and dy)
        if ((gestureState.dy + initialTop1) > limTop && (gestureState.dy + initialTop1) < limBottom)
            this.setState({
                offsetTop1: gestureState.dy,
            })
        if ((gestureState.dx + initialLeft1) > 0 && (gestureState.dx + initialLeft1) < window.width)
            this.setState({
                offsetLeft1: gestureState.dx,
            })

    }

    // When the touch/mouse is lifted
    handlePanResponderEnd1 = (e, gestureState) => {
        const { initialTop1, initialLeft1, offsetLeft1, offsetTop1 } = this.state

        // The drag is finished. Set the initialTop and initialLeft so that
        // the new position sticks. Reset offsetTop and offsetLeft for the next drag.
        this.setState({
            dragging1: false,
            initialTop1: initialTop1 + offsetTop1,
            initialLeft1: initialLeft1 + offsetLeft1,

            height: this.state.height + offsetTop1,
            width: this.state.width + offsetLeft1,
            offsetTop1: 0,
            offsetLeft1: 0,

        })
    }
    render() {
        const { dragging, initialTop, initialLeft, offsetTop, offsetLeft } = this.state
        const { dragging1, initialTop1, initialLeft1, offsetTop1, offsetLeft1 } = this.state
        // Update style with the state of the drag thus far
        const style = {
            backgroundColor: 'rgba(52, 52, 52, 0.1)',
            borderWidth: 1,
            borderColor: 'gray',
            top: initialTop + offsetTop,
            left: initialLeft + offsetLeft,
            width: dragging1 ? this.state.width + offsetLeft1 : this.state.width,
            height: dragging1 ? this.state.height + offsetTop1 : this.state.height,
        }
        const style1 = {
            backgroundColor: 'gray',
            top: dragging1 ? initialTop1 + offsetTop1 : initialTop1 + offsetTop,
            left: dragging1 ? initialLeft1 + offsetLeft1 : initialLeft1 + offsetLeft,
        }
        const styleImage = { width: '100%', height: window.width / this.state.scale }
        return (
            <View style={styles.container} >
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.crop()}
                        style={{
                            backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 50
                        }}>
                        <Text style={{ color: 'white' }}>Crop</Text>
                    </TouchableOpacity>
                </View>
                <Image source={{ uri: this.state.uri }}
                    style={styleImage} />

                <View
                    // Put all panHandlers into the View's props
                    {...this.panResponder.panHandlers}
                    style={[styles.square, style]}
                >
                </View>
                <View
                    {...this.panResponder1.panHandlers}
                    style={[{ width: 5, height: 5, position: 'absolute', }, style1]}>

                </View>
                <View style={{ flex: 1 }} />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    square: {
        position: 'absolute',
        left: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 12,
    }
})

AppRegistry.registerComponent('crop', () => App);