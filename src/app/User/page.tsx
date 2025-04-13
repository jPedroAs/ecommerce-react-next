"use client";
import api from "../../services/api"
import { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2';
import { Users } from "../../Types/UserInterface"
import MainBar from "@/components/MainBar/page";
import { useAuthStore } from "@/store/authStore";



function User() {
    useAuthStore.getState().loadUserFromCookies();
    const id_user = useAuthStore.getState().user?.ID;

    const NomeRef = useRef<HTMLInputElement>(null);
    const EmailRef = useRef<HTMLInputElement>(null);
    const RARef = useRef<HTMLInputElement>(null);
    const RoleRef = useRef<HTMLInputElement>(null);
    const CepRef = useRef<HTMLInputElement>(null);
    const RuaRef = useRef<HTMLInputElement>(null);
    const BairroRef = useRef<HTMLInputElement>(null);
    const CidadeRef = useRef<HTMLInputElement>(null);
    const EstadoRef = useRef<HTMLInputElement>(null);
    const NumeroRef = useRef<HTMLInputElement>(null);
    const TelefoneRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<Users[]>([]);


    useEffect(() => {
        async function fetchUser() {
            try {

                const response = await api.get(`/Account/${id_user}`);
                const data = await response.data;
                console.log(data)
                setUser(Array.isArray(data) ? data : [data]);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        }

        fetchUser();
    }, []);

    async function PutUser(event: React.FormEvent) {
        event.preventDefault();
        try {
            const body = {
                name: NomeRef.current?.value,
                email: EmailRef.current?.value,
                senha: user[0].senha,
                ra: RARef.current?.value,
                telefone: TelefoneRef.current?.value,
                role: RoleRef.current?.value,
                cep: CepRef.current?.value,
                rua: RuaRef.current?.value,
                bairro: BairroRef.current?.value,
                cidade: CidadeRef.current?.value,
                estado: EstadoRef.current?.value,
                numero: NumeroRef.current?.value
            }
            console.log(body);
            const response = await api.patch(`/Account/${id_user}`, body);

            Swal.fire({
                text: "Atualização foi concluído com sucesso.",
                icon: "success",
            });

        } catch {
            Swal.fire({
                text: "Ocorreu um Error.",
                icon: "error",
            });
        }
    }

    // async function handleEdit(productId: string) {

    //     const productToEdit = products.find((product) => product.id === productId);
    //     if (productToEdit) {
    //         setSelectedProduct(productToEdit);
    //         setModalOpen(true);
    //     }
    // }

    async function handleDelete() {
        try {
            const response = await api.delete(`/Account/${id_user}`);
            console.log(response)
            if (response.status == 200) {
                localStorage.removeItem("token");
                window.location.href = "/Login";
            }
        } catch (error) {
            Swal.fire({
                text: "Erro ao deletar o produto.",
                icon: "error",
            });
        }
    }


    return (
        <div className="block bg-white min-h-screen">
            <MainBar />
            <div className="max-w-4xl mx-auto flex flex-col items-center mt-6">
                <h2 className="text-2xl font-bold text-center text-gray-700">Tela do Usuário</h2>
                {user.map((user) => (
                    <form onSubmit={PutUser} key={user.id} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Nome"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.name}
                            ref={NomeRef}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.email}
                            ref={EmailRef}
                        />
                        {/* <input
                            type="password"
                            placeholder="Senha"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.senha} // Supondo que o produto tenha uma propriedade 'senha'
                        /> */}
                        <input
                            type="text"
                            placeholder="RA"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.ra}
                            ref={RARef}
                        />
                        <input
                            type="text"
                            placeholder="Telefone"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.telefone}
                            ref={TelefoneRef}
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.role}
                            readOnly
                            ref={RoleRef}
                        />
                        <input
                            type="text"
                            placeholder="Cep"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.cep}
                            ref={CepRef}
                        />
                        <input
                            type="text"
                            placeholder="Rua"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.rua}
                            ref={RuaRef}
                        />
                        <input
                            type="text"
                            placeholder="Bairro"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.bairro}
                            ref={BairroRef}
                        />
                        <input
                            type="text"
                            placeholder="Cidade"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.cidade}
                            ref={CidadeRef}
                        />
                        <input
                            type="text"
                            placeholder="Estado"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.estado}
                            ref={EstadoRef}
                        />
                        <input
                            type="text"
                            placeholder="Numero"
                            className="border border-gray-300 p-4 rounded-lg w-full text-lg bg-white text-black"
                            defaultValue={user.numero}
                            ref={NumeroRef}
                        />
                        <button
                            onClick={PutUser}
                            className="bg-blue-600 text-white p-4 rounded-lg w-full text-lg hover:bg-blue-700"
                        >
                            Atualizar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white p-4 rounded-lg w-full text-lg hover:bg-blue-700"
                        >
                            Delete
                        </button>
                    </form>
                ))}
            </div>
        </div>

    );
}

export default User
