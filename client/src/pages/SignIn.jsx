import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaEye, FaEyeSlash} from 'react-icons/fa'
import { signInStart, signInSuccess, signInFailure, pageStart } from "../slices/userSlice"
import axios from "axios"
import { toast } from "react-toastify"
import Oauth from "../components/Oauth"

const url = 'http://localhost:8000/api'

const SignIn = () => {
    const { loading} = useSelector((state) => state.user)
    const [showPassword, setShowPassword] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      dispatch(pageStart())
    }, [])

    const submitForm = async (data) => {
      const { email, password} = data
      dispatch(signInStart())
      await axios.post(`${url}/auth/login`, {email, password}).then(response => {
        localStorage.setItem("token", response.data.token)
        dispatch(signInSuccess(response.data.user))
        toast.success("Sign In Successful")
        navigate("/profile")
      }).catch(err => {
        dispatch(signInFailure(err.response.data.message))
        toast.error(err.response.data.message)
      })
    }
  return (
    <div className="p-3 max-w-lg mx-auto">
        <h2 className="text-3xl text-center font-semibold my-7">Sign In</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => submitForm(data))}>

            <input type="email" name="email" id="email" placeholder="Email Address" className="border p-3 rounded-lg" 
            {...register("email", {required: "Email Address is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email Address pattern does not match"} })} />
            {errors.email && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.email.message}</p>)}

            <div className="relative border p-3 rounded-lg bg-white">
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" placeholder="Password" className="focus:outline-none w-100" 
                {...register("password", {required: "Password is required"})}/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            {errors.password && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.password.message}.</p>)}

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">{loading ? 'Loading.....' : 'Log In'}</button>

            <Oauth />
        </form>
        <div className="flex gap-2 mt-5">
            <p>Don&apos;t have an account?</p>
            <Link to="/sign-up">
                <span className="text-blue-700">Sign Up</span>
            </Link>
        </div>
    </div>
  )
}

export default SignIn