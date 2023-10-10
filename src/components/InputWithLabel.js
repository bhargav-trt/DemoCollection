import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const InputWithLabel = ({ label, placeholder, keyboardType = 'default', value, onChangeText, secureTextEntry = false }) => {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                style={styles.input}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={'gray'}
                secureTextEntry={secureTextEntry}
            />
        </>
    )
}

export default InputWithLabel

const styles = StyleSheet.create({
    label: { color: 'gray', fontSize: 18, fontWeight: '500', marginBottom: 10 },
    input: {
        width: '100%',
        // marginHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'lightgray',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
        borderRadius: 5,
        marginBottom: 20
    },
})