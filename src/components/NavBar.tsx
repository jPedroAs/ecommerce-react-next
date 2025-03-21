import Link from "next/link"
import { FaRegUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import ModalCart from "../components/ModalCart/Cart";
import { useEffect, useState, useRef } from "react";
import { Product } from "@/Types/ProdutoInterface";



export default function NavBar() {
    const [modalOpen, setModalOpen] = useState(false);
    function handlerModal() {
        setModalOpen(!modalOpen)
    }

    async function handleCart() {
        setModalOpen(true);
    }

    return (
        <div>
            <nav className="bg-blue-600 p-4 md:flex">
                <div className="container mx-auto flex justify-center items-center">
                    <div id='uni' className="text-white font-bold text-lg">
                        <h1 className='h-176 w-60'>UniStore</h1>
                    </div>
                    <div className="container flex justify-center space-x-8">
                        <Link href="/Home" className="text-white hover:text-blue-200">Home</Link>
                        <Link href="/Produtos" className="text-white hover:text-blue-200">Products</Link>
                        <Link href="/Categories" className="text-white hover:text-blue-200">Categories</Link>
                        <Link href="/Review" className="text-white hover:text-blue-200">Review</Link>
                    </div>
                    <div className="container flex justify-center space-x-3">
                        <button className="text-white hover:text-blue-200"><FaSearch /></button>
                        <button onClick={handleCart} className="text-white hover:text-blue-200"><CiShoppingCart /></button>
                        <Link href="/User" className="text-white hover:text-blue-200"><FaRegUser /></Link>
                    </div>
                </div>
            </nav>
            <ModalCart isOpen={modalOpen} onClosed={handlerModal} />
        </div>
    )
}