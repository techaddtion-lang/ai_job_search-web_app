import React, { useState } from 'react'
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BriefcaseBusiness } from 'lucide-react'

function UserHeader() {

    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    const { user } = useSelector(store => store.auth);

    const recruiter = user?.role == "recruiter"
    const accountCard = (
        <div className='flex items-center gap-2 bg-white rounded-md p-2'>
            <div className='w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center'>
                <BriefcaseBusiness aria-hidden='true' />
            </div>
            <div className='flex flex-col justify-center min-w-[100px]'>
                <h1 className='text-[15px] font-bold'>Find MyGig</h1>
                <p className='text-[12px] font-bold capitalize'>{user?.role} Account</p>
            </div>
        </div>
    );

    return (
        <div className='flex justify-between items-center'>

            <div className=" flex gap-2 items-center">
                {/* <CgMenuRightAlt className=' text-xl font-bold ' /> */}
                <h1 className='text-xl font-bold'>Welcome</h1>
            </div>
            {
                recruiter ? "" : <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    {/* <Search className='h-5 w-5' /> */}
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-[#F2F2F2]'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#2563eb]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            }


            <div>
                {
                    !user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#2563eb] hover:bg-[#5563eb]">Signup</Button></Link>
                        </div>
                    ) : (
                        recruiter ? accountCard :
                            <Link to="/profile">
                                {accountCard}
                            </Link>

                    )
                }

            </div>

        </div>
    )
}

export default UserHeader
