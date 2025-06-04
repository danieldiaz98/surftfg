import { createContext, useEffect, useState, useContext } from "react";
import { client } from "../supabase/client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined para saber si aún está cargando

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.error("Error obteniendo la sesión:", error);
        return;
      }
      setSession(data.session);
    };

    getSession();

    const { data: authListener } = client.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUpNewUser = async (email, password) => {
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error al registrarse:", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Error al iniciar sesión:", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error("Error inesperado:", error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    }
    setSession(null); // Limpia el estado local también
  };

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
