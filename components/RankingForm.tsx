"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Dashboard } from "@uppy/react";
import pt_BR from "@uppy/locales/lib/pt_BR";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import Uppy from "@uppy/core";
import { FaCloudUploadAlt, FaUser, FaListAlt } from "react-icons/fa";

interface CsvRow {
    Student: string;
    "Current Score": string;
}

export default function RankingForm() {
    const [title, setTitle] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [topN, setTopN] = useState("");
    const router = useRouter();
    const [uppy, setUppy] = useState<Uppy | null>(null);

    useEffect(() => {
        const uppyInstance = new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: [".csv"],
            },
            autoProceed: false,
            locale: {
                ...pt_BR,
                strings: {
                    ...pt_BR.strings,
                    dropPasteFiles:
                        "Solte o arquivo .csv aqui, cole ou %{browse}",
                },
            },
        });
        setUppy(uppyInstance);
        return () => uppyInstance.cancelAll();
    }, []);

    const handleFileParse = (file: File): Promise<CsvRow[]> => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                complete: (result) => {
                    const data = result.data as CsvRow[];

                    const isValidData = data.every(
                        (row) => row.Student && row["Current Score"]
                    );

                    if (isValidData) {
                        resolve(data);
                    } else {
                        const error = new Error(
                            "Dados CSV inválidos. Verifique se as colunas 'Student' e 'Current Score' estão presentes."
                        );
                        console.error(error.message);
                        reject(error);
                    }
                },
                error: (error) => {
                    console.error("Erro ao analisar o arquivo CSV:", error);
                    reject(error);
                },
                header: true,
                skipEmptyLines: true,
            });
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uppy) return;

        const files = uppy.getFiles();
        if (files.length > 0) {
            const file = files[0].data as File;

            try {
                const parsedData = await handleFileParse(file);

                const participantsData = parsedData.slice(1).map((row) => ({
                    name: row.Student,
                    score: parseFloat(row["Current Score"]),
                }));

                localStorage.setItem(
                    "participants",
                    JSON.stringify(participantsData)
                );

                router.push(
                    `/ranking?title=${encodeURIComponent(
                        title
                    )}&teacherName=${encodeURIComponent(
                        teacherName
                    )}&topN=${topN}`
                );
            } catch (error) {
                console.error("Erro ao processar o arquivo CSV:", error);
                alert(
                    "Houve um erro ao processar o arquivo. Por favor, tente novamente."
                );
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                    <div className="flex items-center border border-gray-300 rounded-md p-2 hover:bg-blue-100 hover:border-blue-400 transition duration-200 ease-in-out text-black">
                        <FaListAlt className="mr-2 text-gray-500" />
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título da Turma (Ex: AWS re:Start - 1)"
                            className="mt-1 block w-full bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex items-center border border-gray-300 rounded-md p-2 hover:bg-blue-100 hover:border-blue-400 transition duration-200 ease-in-out text-black">
                        <FaUser className="mr-2 text-gray-500" />
                        <input
                            type="text"
                            id="teacherName"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            placeholder="Nome do professor(a)"
                            className="mt-1 block w-full bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex items-center border border-gray-300 rounded-md p-2 hover:bg-blue-100 hover:border-blue-400 transition duration-200 ease-in-out text-black">
                        <FaListAlt className="mr-2 text-gray-500" />
                        <input
                            type="number"
                            id="topN"
                            value={topN}
                            onChange={(e) => setTopN(e.target.value)}
                            min="1"
                            placeholder="Quantas colunas devem aparecer no ranking?"
                            className="mt-1 block w-full bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="relative left-2 text-gray-500">
                        <FaCloudUploadAlt />
                    </label>
                    {uppy && (
                        <Dashboard
                            uppy={uppy}
                            width="100%"
                            height={80}
                            hideUploadButton={true}
                            proudlyDisplayPoweredByUppy={false}
                            className="border border-gray-300 rounded-md bg-gray-100 p-2 transition duration-200 ease-in-out hover:bg-blue-100 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Gerar Ranking
            </button>
        </form>
    );
}
