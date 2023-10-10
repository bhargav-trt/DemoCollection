import { Alert, Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../components/Loader';
import { data } from '../utills/data';
import { Images } from '../assets/images';

const Home = () => {
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false)
    const usersCollection = firestore().collection('Users');
    const [likeItem, setLikeItem] = useState([])

    const logoutUser = () => {
        Alert.alert('LOGOUT', 'Are you sure for Logout?', [
            {
                text: 'NO',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'YES', onPress: () => {
                    try {
                        setLoader(true)
                        auth()
                            .signOut()
                            .then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'SignOut Successfully!',
                                });
                                navigation.navigate('SignIn')
                                AsyncStorage.removeItem('EMAIL');
                                setLoader(false)
                            }
                            );
                    } catch (e) {
                        console.log(e);
                        setLoader(false)
                    }
                },
            },
        ])
    }

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        setLoader(true)
        const currUser = await AsyncStorage.getItem('EMAIL');
        try {
            usersCollection.where('email', '==', currUser).get().then(querySnapshot => {
                querySnapshot.forEach(snapShot => {
                    if (snapShot.data().favItem) {
                        setLikeItem(snapShot.data().favItem)
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false)
        }
    }

    const toggleLike = async (item) => {
        const currUser = await AsyncStorage.getItem('EMAIL');
        const tmpLikeList = [...likeItem];
        if (likeItem?.includes(item.id)) {
            const index = likeItem?.findIndex(data => data == item.id)
            tmpLikeList.splice(index, 1)
        } else {
            tmpLikeList.push(item.id)
        }
        setLikeItem(tmpLikeList)
        try {
            usersCollection.where('email', '==', currUser).get().then(querySnapshot => {
                querySnapshot.forEach(snapShot => {
                    snapShot.ref.update({
                        'favItem': tmpLikeList
                    })
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={logoutUser}
                style={styles.touchLogout}>
                <Image source={Images.logout} style={styles.logoutImg} />
            </TouchableOpacity>
            <View style={styles.headingCon}>
                <Text style={styles.topHeading}>THE LONG WAIT IS OVER</Text>
                <Text style={styles.subHeading}>Winter Collection</Text>
            </View>
            <View style={{ height: 500 }}>
                <FlatList
                    data={data}
                    numColumns={3}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => toggleLike(item)}
                                style={styles.list}>
                                <Image source={Images.collection} style={styles.collectionImg} />
                                <Image source={
                                    likeItem?.includes(item.id) == true ?
                                        Images.like
                                        : Images.disLike}
                                    style={[styles.heart, { tintColor: likeItem?.includes(item.id) == true ? 'red' : 'white' }]}
                                />
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item) => item.id}
                    extraData={likeItem}
                />
            </View>
            <Text style={styles.favText}>{`Fav Item: ${!likeItem ? 0 : likeItem?.length}`} </Text>
            <Loader visible={loader} />
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    touchLogout: { position: "absolute", top: 70, right: 30, },
    logoutImg: { tintColor: 'black', height: 25, width: 25, resizeMode: "contain" },
    headingCon: { justifyContent: 'flex-start', alignItems: 'flex-start', width: '80%', marginBottom: 30 },
    topHeading: { color: 'black', fontSize: 14, fontWeight: '300' },
    subHeading: { fontSize: 25, textAlign: 'center', fontWeight: "bold", },
    list: {
        height: 155, width: 100, margin: 5,
    },
    collectionImg: { height: "100%", width: '100%', resizeMode: "contain" },
    heart: { position: 'absolute', bottom: 8, right: 5, tintColor: 'red', height: 17, width: 17, resizeMode: "contain" },
    favText: { fontWeight: 'bold' },
})