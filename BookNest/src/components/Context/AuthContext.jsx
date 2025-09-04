import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged ,signOut} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     if(currentUser && currentUser.emailVerified){
       setUser(currentUser);
     }else{
      setUser(null)
     }
      setLoading(false);
     
    });

    return () => unsubscribe();
  }, []);


  

   const logout = () =>{
      return signOut(auth);
   }
  return (
    <AuthContext.Provider value={{ user, logout}}>
      { !loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
