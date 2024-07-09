import { GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { FaGoogle } from 'react-icons/fa6'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const url = 'http://localhost:8000/api'

const Oauth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            await axios.post(`${url}/auth/googleSignIn`, {name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}).then(response => {
                console.log(response)
                localStorage.setItem("token", response.data.token)
                dispatch(signInSuccess(response.data.user))
                toast.success(response.data.message)
                navigate("/profile")
            })
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <button type="button" className="bg-red-700 p-3 text-white rounded-lg hover:opacity-90 cursor-pointer" onClick={handleWithGoogle}> <FaGoogle /> Continue With Google</button>
  )
}

export default Oauth