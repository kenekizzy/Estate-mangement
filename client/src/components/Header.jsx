import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
    const { currentUser } = useSelector(state => state.user)
  return (
    <header className="bg-slate-200 shadow-md py-3">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
            <Link to='/'>
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                    <span className="text-slate-500">Estate</span>
                    <span className="text-slate-700">Listing</span>
                </h1>
            </Link>
            <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input type="text" placeholder="Search....." className='bg-transparent focus:outline-none w-24 sm:w-64' />
                <FaSearch className='text-slate-600'/>
            </form>
            <ul className='flex gap-4'>
                <Link to='/'>
                    <li className='text-slate-700 cursor-pointer hidden hover:underline sm:inline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='text-slate-700 cursor-pointer hidden hover:underline sm:inline'>About</li>
                </Link>
                <Link to='/profile'>
                    {currentUser ? (
                        <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile'/>
                    ) : (
                        <li className='text-slate-700 cursor-pointer hover:underline'>Sign In</li>
                    )
                    }
                </Link>              
            </ul>
        </div>
    </header>
  )
}

export default Header