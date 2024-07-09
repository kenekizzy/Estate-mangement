import { useEffect, useState } from "react"

const url = 'http://localhost:8000/api'

const Verification = () => {
    const [token, setToken] = useState()
    const [userName, setUserName] = useState()
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    setToken(urlParams.get('token'))
    setUserName(urlParams.get('username'))
  }, [location.search])

  const verifyUser = async () => {
    
  }
  return (
    <div>
        <p>Hi {userName}, Thanks for joining Estate Listing. Click the button below to verify your email and complete your registration.</p>
        <button className="" onClick={verifyUser}>Verify the User</button>
    </div>
  )
}

export default Verification