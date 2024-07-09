/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { useEffect, useState } from "react";
import axios from "axios";
import ListingItem from "../components/ListingItem";

const url = 'http://localhost:8000/api'

const Home = () => {
  SwiperCore.use([Navigation])
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])

  useEffect(() => {
    const fetchOfferListings = async () => {
      await axios.get(`${url}/listing/get-all-listing?offer=true&limit=4`).then((response) => {
        console.log(response)
        setOfferListings(response.data.listings)
      }).catch((err) => {
        console.log(err)
      })
    }
    const fetchRentListings = async () => {
      await axios.get(`${url}/listing/get-all-listing?rent=true&limit=4`).then((response) => {
        console.log(response)
        setRentListings(response.data.listings)
      }).catch((err) => {
        console.log(err)
      })
    }
    const fetchSaleListings = async () => {
      await axios.get(`${url}/listing/get-all-listing?sale=true&limit=4`).then((response) => {
        console.log(response)
        setSaleListings(response.data.listings)
      }).catch((err) => {
        console.log(err)
      })
    }
    fetchOfferListings()
    fetchRentListings()
    fetchSaleListings()
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next place 
        <span className="text-slate-500"> perfect</span>
        <br /> 
        place with ease</h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the best place to find your next perfect place to
            live.
            <br />
            We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {offerListings && offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <SwiperSlide key={index}>
              <div key={listing._id} style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className="h-[500px]"></div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 &&  (
          <div className="">
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 &&  (
          <div className="">
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?rent=true'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 &&  (
          <div className="">
            <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?sale=true'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home