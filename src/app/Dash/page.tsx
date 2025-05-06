'use client';
import MainBar from '@/components/MainBar/page';
import api from "@/services/api";
import { useAuthStore } from '@/store/authStore';
import { DashInterface, DashOthresInterface } from '@/Types/Interface';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import Footer from '@/components/Footer/Footer';

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import Footer from '@/components/Footer/Footer';



function Dashboard() {
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [loading, setLoading] = useState(true);
    const [dash, setDash] = useState<DashInterface>();
    const [dashOthers, setDashOthers] = useState<DashOthresInterface>();

    const getDash = async () => {
        useAuthStore.getState().loadUserFromCookies();
        const curso = useAuthStore.getState().user?.Curso;
        const universidade = useAuthStore.getState().user?.Universidade;

        let data: any = {
            curso,
            universidade,
        };

        if (startDate && endDate) {
            data = {
                ...data,
                data_init: startDate,
                data_end: endDate,
            };
        }

        try {
            const response = await api.post("/Dash", data);
            setDash(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar dados do dashboard", err);
        }
    };

    const getDashCurso = async () => {
        try {
            const response = startDate && endDate
                ? await api.get(`/DashGetOthers/${startDate}/${endDate}`)
                : await api.get("/DashGetOthers");

            console.log(response.data)
            setDashOthers(response.data);
        } catch (err) {
            console.error("Erro ao buscar dados do dashboard", err);
        }
    };

    const exportarExcel = async () => {
        const curso = useAuthStore.getState().user?.Curso;
        const universidade = useAuthStore.getState().user?.Universidade;

        let data: any = { curso, universidade };
        if (startDate && endDate) {
            data = { ...data, data_init: startDate, data_end: endDate };
        }

        try {
            const response = await api.post("/Excel", data, {
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            let fileName = `Relatorio_Vendas_${new Date().toISOString()}.xlsx`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) {
                    fileName = decodeURIComponent(match[1]);
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Erro ao exportar o Excel", err);
        }
    };



    useEffect(() => {
        getDash();
        getDashCurso();
    }, []);

    // if (!dash) return;

    const salesData = dash?.totalVendido.map(item => ({
        name: item.mes,
        vendas: item.total
    }));

    const produtosVendidos = dash?.produtoMaisVendido.map(item => ({
        name: item.nomeProduto,
        quantidade: item.quantidade
    }));

    const faturamentoMeses = dash?.faturamentoUltimosMeses.map(item => ({
        name: item.mes,
        faturamento: item.faturamento
    }));

    const faturamentoData = dashOthers?.totalVendido.map(item => ({
        curso: item.curso,
        total: item.totalVendido
    })) || [];

    const COLORS = ['#0d4087', '#a2a008', '#18a70e', '#FF8042'];

    const totalProdutos = dash?.produtosTotal;
    const usuariosAtivos = dash?.usuariosTotal;
    const vendasMes = dash?.totalVendido.reduce((acc, f) => acc + f.total, 0);
    const produtoMaisVendido = dash?.produtoMaisVendido[0]?.nomeProduto ?? "Nenhum";

    return (
        <div className='bg-white'>
            <MainBar />
            {loading ? (
                <div className="bg-white min-h-screen p-6 flex gap-6 mb-6 text-black"><h1>Carregando...</h1></div>
            ) : (
                <main className="bg-white min-h-screen p-6">
                    <h1 className="text-2xl font-bold mb-6 text-black">Dashboard</h1>

                    <div className="flex gap-6 mb-6">
                        <div className="relative w-fit">
                            <label className="text-sm block mb-1 text-black">Início</label>
                            <DatePicker
                                selected={startDate ?? null}
                                onChange={(date) => setStartDate(date)}
                                locale={ptBR}
                                dateFormat="dd/MM/yyyy"
                                className="border rounded px-2 py-1 bg-gray-100 text-black pr-10"
                                calendarClassName="bg-black text-white p-2 rounded-lg"
                                dayClassName={() => "hover:bg-gray-700"}
                                popperPlacement="bottom"
                                placeholderText="dd/mm/yyyy"
                            />
                            {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" /> */}
                        </div>

                        <div className="relative w-fit">
                            <label className="text-sm block mb-1 text-black">Início</label>
                            <DatePicker
                                selected={endDate ?? null}
                                onChange={(date) => setEndDate(date)}
                                locale={ptBR}
                                dateFormat="dd/MM/yyyy"
                                className="border rounded px-2 py-1 bg-gray-100 text-black pr-10"
                                calendarClassName="bg-black text-white p-2 rounded-lg"
                                dayClassName={() => "hover:bg-gray-700"}
                                popperPlacement="bottom"
                                placeholderText="dd/mm/yyyy"
                            />
                            {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" /> */}
                        </div>
                        <button
                            onClick={getDash}
                            disabled={!startDate || !endDate}
                            className={`mt-6 px-4 py-2 rounded text-white ${!startDate || !endDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
                        >
                            Filtrar
                        </button>
                        <button
                            onClick={exportarExcel}
                            className="mt-6 px-4 py-2 rounded text-white bg-green-600"
                        >
                            Exportar Excel
                        </button>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                        <div className="p-6 shadow rounded-xl bg-gray-100">
                            <p className="text-black text-[20px]">Total de Produtos Registrados</p>
                            <p className="text-3xl font-bold text-black">{totalProdutos}</p>
                        </div>

                        <div className="p-6 shadow rounded-xl bg-gray-100">
                            <p className="text-black text-[20px]">Usuários Ativos</p>
                            <p className="text-3xl font-bold text-black">{usuariosAtivos}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="p-6 shadow rounded-xl bg-gray-100">
                            <p className="text-black text-[20px]">Total de Vendas Mensais</p>
                            <p className="text-3xl font-bold text-black">{vendasMes}</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fill: 'black' }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="vendas" stroke="#f5431b" strokeWidth={5} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="p-6 shadow rounded-xl bg-gray-100">
                            <p className="text-black text-[20px] mb-6">Produto Mais Vendido no Mês</p>
                            <p className="text-3xl font-bold text-black mb-10">{produtoMaisVendido}</p>
                            <ResponsiveContainer width="100%" height={100}>
                                <BarChart data={produtosVendidos}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fill: 'black' }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="quantidade" fill="#268149" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-6 shadow rounded-xl bg-gray-100 col-span-2 mt-5">
                        <p className="text-black text-[20px]">Vendas de Cada Curso</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={faturamentoData}
                                    dataKey="total"
                                    nameKey="curso"
                                    innerRadius="60%"
                                    outerRadius="90%"
                                    fill="#8884d8"
                                    label
                                >
                                    {faturamentoData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                    <div className="p-6 shadow rounded-xl bg-gray-100 col-span-2 mt-5">
                        <p className="text-black text-[20px]">Faturamento</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={faturamentoMeses}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fill: 'black' }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="faturamento" fill="#138deb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </main>

            )}
            <Footer />
        </div>
    );
}

export default Dashboard;
