import React from 'react';
import { FaFacebookF, FaGithub, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';


export default function Footer() {
    return (
        <div className='py-[50px] h-[200px] bg-black text-white'>
            <div className='px-[30px] flex justify-between'>
                <div>
                    <img
                        className='w-[150px] mb-[20px]'
                        src="/images/logo/logo1.png" alt="" />
                    <div className='flex text-[24px] gap-[20px]'>
                        <Link to="https://github.com/alsrb1205/airlime">
                            <FaGithub />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

