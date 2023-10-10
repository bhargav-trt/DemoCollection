import React from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';

const Loader = ({ visible }) => {
    return (
        <>
            {visible ? (
                <View
                    style={{
                        flex: 1,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator
                        size={'large'}
                        animating={visible}
                        color={'gray'}
                    />
                </View>
            ) : null}
        </>
    );
};

export default Loader;
