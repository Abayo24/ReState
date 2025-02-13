import {Account, Avatars, Client, Databases, OAuthProvider} from "react-native-appwrite";
import * as Linking from 'expo-linking';
import {openAuthSessionAsync} from "expo-web-browser";

//LEGO Settings/ Name
export const config = {
    platform: 'com.abayo.restate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
    reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
    propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
}

// LEGO Brain
export const client = new Client();

client.setEndpoint(config.endpoint!) // where to find Appwrite
      .setProject(config.projectId!) // which game its playing
      .setPlatform(config.platform!) // which device

//LEGO Features
export const avatar = new Avatars(client);// profile picture
export const account = new Account(client); // account
export const databases = new Databases(client);

export async function login() {
    try{
        const redirectUri = Linking.createURL('/'); //  link user will be sent to after logging in.

        const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri); // asks magic ticket from google

        if (!response) throw new Error("Failed to login");

        // open browser so users can log in
        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        )

        if (browserResult.type !== 'success') throw new Error("Failed to login");

        // After log in we check url to get secret and id
        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!userId || !secret) throw new Error("Failed to login");

        //create session that keeps user logged in
        const session = await account.createSession(userId, secret);

        if (!session) throw new Error("Failed to login");

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession('current')
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const response = await account.get(); // ask appwrite who is the logged-in user

        if (response.$id) {
            const useAvatar = avatar.getInitials(response.name);

            return {
                ...response,
                avatar: useAvatar.toString(),
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}