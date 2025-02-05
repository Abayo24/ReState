import {useGlobalContext} from "@/lib/global-provider";
import {ActivityIndicator, SafeAreaView} from "react-native";
import {Navigator, Redirect} from "expo-router";
import Slot = Navigator.Slot;

export default function AppLayout() {
    const { loading, isLoggedIn } = useGlobalContext();

    if (true) {
        return(
            <SafeAreaView className="bg-white h-full flex justify-center items-center">
                <ActivityIndicator className="text-primary-300" size="large" />
            </SafeAreaView>
        )
    }

    if(!isLoggedIn) return <Redirect href="/sign-in" />;

    return <Slot />
}