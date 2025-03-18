"use client"
import '../Home/index.css';
import { useEffect, useState } from "react";
import api from "../../services/api"
import { Product } from "../../Types/ProdutoInterface"
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import MainBar from '@/components/MainBar/MainBar';
import NavBar from '@/components/NavBar';


async function fetchHistorico() {
    const res = await fetch("https://eiif5bjnih.execute-api.us-east-1.amazonaws.com/HistoricoMovimentacao");
    if (!res.ok) {
      throw new Error("Erro ao buscar os dados");
    }
    return res.json();
  }
  
  export default async function HistoricoPage() {
    let historico = [];
    try {
      historico = await fetchHistorico();
    } catch (error) {
      console.error(error);
    }
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Histórico de Movimentações</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">ID</th>  
              <th className="border p-2 text-black">Produto</th>
              <th className="border p-2 text-black">Tipo</th>
              <th className="border p-2 text-black">Quantidade</th>
              <th className="border p-2 text-black">Data</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item: any) => (
              <tr key={item.id} className="border">
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.produto}</td>
                <td className="border p-2">{item.tipoMovimentacao}</td>
                <td className="border p-2">{item.qtd}</td>
                <td className="border p-2">{new Date(item.dataMovimentacao).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  