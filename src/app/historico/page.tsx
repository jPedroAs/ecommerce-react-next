"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import MainBar from "@/components/MainBar/page";

const ITEMS_PER_PAGE = 10;

export default function HistoricoPage() {
  const [histrory, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchHistorico() {
      const response = await api.get("/HistoricoMovimentacao");
      setHistory(response.data);
    }
    fetchHistorico();
  }, []);

  const totalPages = Math.ceil(histrory.length / ITEMS_PER_PAGE);
  const currentItems = histrory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <MainBar />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-6">
        Histórico de Movimentações
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full text-left border border-gray-300 divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Produto</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Quantidade</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Data</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Descrição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{item.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{item.produto}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{item.tipoMovimentacao}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{item.qtd}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {new Date(item.dataMovimentacao).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">{item.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Anterior
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded font-medium ${currentPage === page
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

    </div>
  );
}
