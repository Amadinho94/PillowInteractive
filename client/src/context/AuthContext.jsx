import { token } from "./token"
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AuthContext = createContext(null)



export const AuthProvider = ({children}) => {
    
    // State qui va stocker les données de l'utilisateur connecté
    const [user, setUser] = useState({})
    
    const [isConnected, setIsConnected] = useState(false)
    const navigate = useNavigate()
    
    
    /* Fonction qui va envoyer le token généré lors de la connexion
    dans le local storage et rediriger l'utilisateur */
    const login = async (userData) => {
        
        localStorage.setItem("userToken", JSON.stringify(userData.userToken))
        setUser(userData)
        setIsConnected(true)
        
        toast.success("Vous êtes connecté")
        
        setTimeout(() => {
            navigate("/")
        }, 100)
            
        // if (userData.role === "admin") {
            
        //     setTimeout(() => {
        //         navigate("/admin/tableaudebord")
        //     }, 100)
            
        // } else {
            
        //     setTimeout(() => {
        //         navigate("/user/tableaudebord")
        //     }, 100)
        // }
    }
    
    
    /* Fonction de déconnexion qui va retirer le token du local storage
    et rediriger vers la page d'accueil */
    const logout = () => {
        
        localStorage.removeItem("userToken")
        setUser({})
        setIsConnected(false)
        
        toast.success("Vous êtes déconnecté")
        
        setTimeout(() => {
                navigate("/")
        }, 100)
        
    }
    
    
    /* Fonction qui change la valeur du state dans le tableau
    des dépendances pour pouvoir faire une nouvelle requete au serveur
    lors d'une mise à jour du compte utilisateur par exemple */
    const update = () => {
        
        setIsConnected(!isConnected)
    }
    
    
    useEffect(() =>  {
        
        /* Fonction qui va récupérer le token du local storage
        puis faire une requête au serveur pour vérifier si token valide
        puis va renvoyer les données de l'utilisateur */
        const getUser = async () => {
            
            try {
                
                const tokenFromLS = JSON.parse(localStorage.getItem("userToken"))
                
                if (tokenFromLS) {
                    const serverRes = await axios.get("/api/user/check", {headers : token()})
                    
                    const { _id, role, username, email, userToken } = serverRes.data
                    
                    setUser({
                        id : _id,
                        username,
                        email,
                        userToken : tokenFromLS,
                        role,
                    })
                }
                
            } catch (e) {
                localStorage.removeItem("userToken")
            }
        }
        
        getUser()
        
    }, [isConnected])
    /* useEffect se déclenche à chaque connexion et chaque appel de la fonction
    update (donc mise à jour du compte utilisateur) */
    
    
    return (
        
        <AuthContext.Provider value={{user, login, logout, update}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
