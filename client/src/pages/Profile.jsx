import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, pageStart, updateUserFailure, updateUserStart, updateUserSuccess } from "../slices/userSlice"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { Link, useNavigate } from "react-router-dom"
import { app } from "../firebase"
import axios from "axios"
import {toast} from 'react-toastify'

//Firebase Query for image storage
// allow read;
// allow write: if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')

const url = 'http://localhost:8000/api'

const Profile = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userName, setUserName] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email)
  const [password, setPassword] = useState("")
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Get token from local storage
const token = localStorage.getItem('token');

// Set default headers for Axios
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


  const fileRef = useRef(null)

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, `profile/${fileName}`)

    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) =>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFilePercent(Math.round(progress))
    },() => {
      setFileUploadError(true)
    },()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setAvatarUrl(downloadUrl)
      })
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const updateData = {username: userName, email, avatar: avatarUrl}
    dispatch(updateUserStart())
    await axios.put(`${url}/user/update/${currentUser._id}`, updateData).then(response => {
      dispatch(updateUserSuccess(response.data.user))
      toast.success(response.data.message)
      navigate("/")
  }).catch(err => {
      dispatch(updateUserFailure(err.response.data.message))
      toast.error(err.response.data.message)
  })
  }

  const handleDelete = async() => {
    dispatch(deleteUserStart())
    await axios.delete(`${url}/user/delete/${currentUser._id}`).then(response => {
      console.log(response)
      dispatch(deleteUserSuccess(response.data))
      toast.success(response.data.message)
      localStorage.clear()
      navigate("/sign-up")
  }).catch(err => {
      dispatch(deleteUserFailure(err.response.data.errors[0].message))
      toast.error(err.response.data.errors[0].message)
  })
  }

  const signUserOut = () => {
    localStorage.clear()
    toast.success("Log Out Successful")
    dispatch(pageStart())
    navigate("/sign-in")
  }

  const handleShowListings = async() => {
    await axios.get(`${url}/user//listings/${currentUser._id}`).then(response => {
      setUserListings(response.data)
    }).catch(err => {
      console.log(err)
      toast.error(err.response.data.message)
    })
  }

  const handleDeleteListing = async (id) => {
    await axios.delete(`${url}/listing/delete-listing/${id}`).then((response) => {
      toast.success(response.data.message)
      setUserListings((prev) => prev.filter((listing) => listing._id !== id))
    }).catch(err => {
      toast.error(err.response.data.message)
    })
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} accept="images/*" hidden />
        <img onClick={() => fileRef.current.click()} className="rounded-full w-24 h-24 object-cover cursor-pointer my-2 self-center" src={avatarUrl || currentUser.avatar} alt="Profile Image" />
        <p>
          {fileUploadError ? (<span className="text-red-700 text-small self-center">File Image Upload Error (Image must be less than 2mb)</span>) :
          filePercent > 0 && filePercent < 100 ? (<span className="text-slate-700 self-center">{`Uploading ${filePercent}%`}</span>) :
          filePercent == 100 ? (<span className="text-green-700 self-center">Image Successfully Uploaded</span>) : ""
          }
        </p>

        <input type="text" className="p-3 border rounded-lg" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />

        <input type="email" className="p-3 border rounded-lg" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="p-3 border rounded-lg" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <button className="p-3 bg-blue-500 rounded-lg text-white hover:opacity-90 disabled:opacity-80">Update Profile</button>
        <Link className="bg-green-700 text-uppercase p-3 text-center rounded-lg text-white opacity-95" to='/create-listing'>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer" onClick={signUserOut}>Sign Out</span>
      </div>
      <button className="text-green-700 w-full" onClick={handleShowListings}>Show Listings</button>

      {userListings && userListings.length > 0 && 
        userListings.map((listing) => (
          <div className="border rounded-lg p-3 flex justify-between items-center" key={listing._id}>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className="w-16 h-16 object-contain"/>
            </Link>
            <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate gap-4" to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col items-center">
                <button className="text-red-700" onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700">Edit</button>
                </Link>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Profile