"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import RankingChart from "../../components/RankingChart";
import { useSearchParams } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { RiScreenshot2Line } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import html2canvas from "html2canvas";

interface Participant {
    name: string;
    score: number;
}

const RankingPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const title = searchParams.get("title") || "";
    const teacherName = searchParams.get("teacherName") || "";
    const topN = searchParams.get("topN") || "";
    const participantsData = searchParams.get("participants");
    const chartRef = useRef<HTMLDivElement>(null);

    const participants: Participant[] = participantsData
        ? JSON.parse(decodeURIComponent(participantsData))
        : [];

    useEffect(() => {
        setIsClient(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const handleScreenshot = async () => {
        if (chartRef.current) {
            try {
                const canvas = await html2canvas(chartRef.current, {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                });
                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = "ranking_screenshot.png";
                link.click();
            } catch (error) {
                console.error("Erro ao gerar screenshot:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center">
                    <AiOutlineLoading className="animate-spin text-4xl text-blue-600" />
                    <p className="mt-4 text-lg text-white">Carregando...</p>
                </div>
            </div>
        );
    }

    const handleRedirectToHome = () => {
        if (isClient) {
            router.push("/");
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500">
            <div className="fixed top-0 left-0 w-full shadow-sm z-10 bg-opacity-70 backdrop-blur-lg flex justify-between items-center px-4">
                <button
                    onClick={handleRedirectToHome}
                    className="text-white rounded p-1 hover:bg-[#445F6F]"
                    disabled={!isClient}
                    title="Volte para home"
                >
                    <IoHomeOutline size={26} />
                </button>
                <div className="font-serif text-xl text-white underline underline-offset-[6px] decoration-blue-300 decoration-2">
                    Ranking AWS re:Start
                </div>

                <div className="relative flex">
                    <button
                        onClick={handleScreenshot}
                        className="text-white p-1 rounded hover:tooltip-hover hover:bg-[#445F6F]"
                        title="Tirar uma captura de tela"
                    >
                        <RiScreenshot2Line size={28} />
                    </button>
                </div>
            </div>

            <div className="mt-14 flex flex-col items-center justify-center w-full pl-8 pr-8">
                <section
                    ref={chartRef}
                    className="relative w-full max-w-full px-5 py-8 mb-20 rounded-lg shadow-lg flex flex-col items-center bg-[#DFDBE5] bg-opacity-90"
                    style={{
                        backgroundColor: "#0ab2d6",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: "56px 28px",
                        backgroundRepeat: "repeat",
                    }}
                >
                    <RankingChart
                        data={participants}
                        title={title}
                        teacher={teacherName}
                        podiumLimit={Number(topN)}
                    />
                </section>
            </div>
        </main>
    );
};

export default RankingPage;
