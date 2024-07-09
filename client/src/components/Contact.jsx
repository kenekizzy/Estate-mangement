/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Contact = ({ listing }) => {
    const [landlord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')

    const url = 'http://localhost:8000/api'

    useEffect(() => {
        const fetchLandLord = async () => {
            await axios.get(`${url}/user/${listing.userRef}`).then((response) => {
                console.log(response)
                setLandLord(response.data.user)
            }).catch((err) => {
                console.log(err)
            })
        }

        fetchLandLord()
    }, [listing.userRef])

  return (
    <div className="flex flex-col gap-4">
        <p>Contact <span className="font-semibold">{landlord.username}</span>{' '} for{' '} <span className="font-semibold">{landlord.name.toLowerCase()}</span></p>
        <textarea name="message" id="message" rows='2' value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter Your Message" className="w-full border p-3 rounded-lg"></textarea>

        <Link to={`mailto:${landlord.email}?subject=Regarding ${landlord.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
            Send Message
        </Link>
    </div>
  )
}

export default Contact