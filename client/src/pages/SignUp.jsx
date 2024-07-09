import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { FaEye, FaEyeSlash} from 'react-icons/fa'
import { signInStart, signInFailure } from "../slices/userSlice"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Oauth from "../components/Oauth"

// const url = 'http://localhost:8000/api'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { loading } = useSelector((state) => state.user)
    const {register, handleSubmit, formState: {errors}, watch} = useForm()
    const password = watch("password");

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const submitForm = async (data) => {
        const { username, email, password } = data
        
        dispatch(signInStart())
        
         axios.post(`/url/auth/signup`, {username, email, password}).then(response => {
             toast.success(response.statusText)
             navigate("/sign-in")
           }).catch(err => {
             dispatch(signInFailure(err.response.data.message))
             toast.error(err.response.data.message)
           })
    }
  return (
    <div className="p-3 max-w-lg mx-auto">
        <h2 className="text-3xl text-center font-semibold my-7">Sign Up</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => submitForm(data))}>
            <input type="text" name="username" id="username" placeholder="Username" className="border p-3 rounded-lg" 
            {...register("username", {required: "Username is required.", maxLength: { value: 40, message: "Username should have a max length of 40 character"}})}/>
            {errors.username && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.username.message}</p>)}

            <input type="email" name="email" id="email" placeholder="Email Address" className="border p-3 rounded-lg" 
            {...register("email", {required: "Email Address is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email Address pattern does not match"} })} />
            {errors.email && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.email.message}</p>)}

            <div className="relative border p-3 rounded-lg bg-white">
                <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder="Password" className="w-100 border-none focus:outline-none" 
                {...register("password", {required: "Password is required", pattern: {value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: "Password must contain one uppercase, one lowercase, one number and a special character"}})} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            {errors.password && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.password.message}.</p>)}

            <div className="relative border p-3 rounded-lg bg-white">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" className="w-100 border-none focus:outline-none" 
                {...register("confirmPassword", {required: "Confirm your password.", validate: value => value == password || "Passwords do not match"})} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            {errors.confirmPassword && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.confirmPassword.message}</p>)}

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">{loading ? 'Loading.....' : 'Sign Up'}</button>

            <Oauth />
        </form>
        <div className="flex gap-2 mt-5">
            <p>Have an account?</p>
            <Link to="/sign-in">
                <span className="text-blue-700">Sign In</span>
            </Link>
        </div>
    </div>
  )
}

export default SignUp