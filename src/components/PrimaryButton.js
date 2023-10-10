import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const PrimaryButton = ({ onPress, label }) => {
    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.btn}>
                <Text style={styles.text}>{label}</Text>
            </TouchableOpacity>
        </>
    )
}

export default PrimaryButton

const styles = StyleSheet.create({
    btn: {
        backgroundColor: 'orange',
        width: '100%',
        // marginHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        borderRadius: 5,
        elevation: 10
    },
    text: {
        color: "white",
        textAlign: "center",
    }
})