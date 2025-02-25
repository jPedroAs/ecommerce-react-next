"use client"
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";

export default function NavBar() {
    return (
        <nav className="bg-blue-600 p-4 md:flex">
            <div className="container mx-auto flex justify-center items-center">
                <div id='uni' className="text-white font-bold text-lg">
                    <h1 className='h-176 w-60'>UniStore</h1>
                </div>
                <div className="container flex justify-center space-x-8">
                    <a href="/Home" className="text-white hover:text-blue-200">Home</a>
                    <a href="#" className="text-white hover:text-blue-200">Features</a>
                    {/* <a href="/Produtos" className="text-white hover:text-blue-200">Products</a> */}
                    <Link href="/Produtos">Products</Link>
                    <a href="#" className="text-white hover:text-blue-200">Categories</a>
                    <a href="#" className="text-white hover:text-blue-200">Review</a>
                    <a href="#" className="text-white hover:text-blue-200">Blogs</a>
                </div>
                <div className="container flex justify-center space-x-3">
                    <a href="#" className="text-white hover:text-blue-200"><FaSearch /></a>
                    <a href="#" className="text-white hover:text-blue-200"><CiShoppingCart /></a>
                    <a href="#" className="text-white hover:text-blue-200"><FaRegUser /></a>
                </div>
            </div>
        </nav>
    )
}