import { Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { isEmpty, validateEmail } from '../utills/validation';
import auth from '@react-native-firebase/auth';
import Loader from '../components/Loader';
import InputWithLabel from '../components/InputWithLabel';
import PrimaryButton from '../components/PrimaryButton';
import Toast from 'react-native-toast-message';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false)

    const userValid = () => {
        Keyboard.dismiss();
        if (isEmpty(email)) {
            Toast.show({
                type: 'error',
                text1: 'Email is required!',
            });
            return false;
        }else if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Enter valid email',
            });
            return false;
        }else if (isEmpty(password)) {
            Toast.show({
                type: 'error',
                text1: 'Password is required',
            });
            return false;
        } else if (password.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Enter valid password',
            });
            return false;
        }

        return true;
    }


    const requestLogin = async () => {
        if (userValid()) {
            try {
                setLoader(true)
                const userCredential = await auth().signInWithEmailAndPassword(email.toLowerCase(), password);
                // User is signed in
                Toast.show({
                    type: 'success',
                    text1: 'LoggedIn Successfully!',
                });
                navigation.navigate('Home')
                setEmail('');
                setPassword('');
            } catch (error) {
                setLoader(false)
                Toast.show({
                    type: 'error',
                    text1: 'LoggedIn failed!',
                });
                console.log('Error signing in:', error);
            }
        }
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                <Text style={styles.heading}>{'Login into existing\n Account'}</Text>
                <Text style={styles.subHeading}>{'Not Registered?'}<Text
                    onPress={() => navigation.navigate('SignUp')}
                    style={styles.orangeText}> Create an account</Text></Text>
                <View style={{ justifyContent: "center", alignItems: 'center' }}>
                    <InputWithLabel
                        label={'EMAIL'}
                        placeholder={"hello@gmail.com"}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={text => setEmail(text)} />
                    <InputWithLabel
                        label={'PASSWORD'}
                        placeholder={"Password"}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)} />
                </View>
                <PrimaryButton onPress={requestLogin} label={'Sign In'} />
            </KeyboardAvoidingView>
            <Loader visible={loader} />
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    heading: { fontSize: 25, textAlign: 'center', fontWeight: "bold", marginBottom: 40 },
    subHeading: { fontSize: 18, textAlign: 'center', fontWeight: "500", marginBottom: 40 },
    orangeText: { color: 'orange', fontWeight: "bold" },

})
