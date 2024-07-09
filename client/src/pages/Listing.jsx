import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { SwiperSlide, Swiper } from "swiper/react"
import { Navigation } from 'swiper/modules';
import Contact from "../components/Contact"
import SwiperCore from 'swiper'
import 'swiper/css/bundle';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa'

const url = 'http://localhost:8000/api'

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams()
  const [listing, setListing] = useState({})
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListingData = async () => {
      await axios.get(`${url}/listing/get-listing/${id}`).then((response) => {
        setListing(response.data.listing)
        console.log(listing)
      }).catch((err) => {
        console.log(err)
      })
    }

    fetchListingData()
  }, [])
  return (
    <main>
      {listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls?.map((url) => (
                  <SwiperSlide key={url}>
                    <div className="h-[550px]" style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover'
                    }}></div>
                  </SwiperSlide>
                ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                <FaShare className="text-slate-500"/>
          </div>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">{listing.name} - ${''}{
              listing.offer ? listing.discountPrice : listing.regularPrice 
            }
            {listing.type === 'rent' && '/month'}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700"/>
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type == 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                  <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
              )}
            </div>
            <p>
              <span>Description -</span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  )
}

export default Listing