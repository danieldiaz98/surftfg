import { createContext, useEffect, useState, useContext } from "react";
import { client } from "../supabase/client";
const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    const signUpNewUser = async (email, password) => {
        const { data, error } = await client.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error("there was a problem signing up:", error);
            return {success: false, error};
        }
        return { success: true, data};
    };

    useEffect(() => {
        client.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });
    
        client.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
      }, []);

    const signInUser = async (email, password) => {
        try {
            const {data, error} = await client.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                console.error("sign in error ocurred: ", error);
                return {success:false, error: error.message}
            }
            console.log("sign-in success: ", data);
            return {success: true, data}
        } catch(error) {
            console.error("an error ocurred: ", error)
        }
    }

    

    const signOut = () => {
        const { error } = client.auth.signOut();
        if (error) {
            console.error("there was an error: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}