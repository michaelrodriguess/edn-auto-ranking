"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RankingChart from "../../components/RankingChart";

interface Participant {
    name: string;
    score: number;
}

const mockData: Participant[] = [
    { name: "Luiz Gustavo", score: 100 },
    { name: "Maria DB", score: 100 },
    { name: "João Silva", score: 100 },
    { name: "Ana Souza", score: 98 },
    { name: "Carlos Santos", score: 97 },
    { name: "Levi de Assis", score: 99 },
    { name: "Lucas Oliveira", score: 85 },
    { name: "Michael Rodr", score: 80 },
    { name: "Joseph couto", score: 99 },
    { name: "Irinei naldo1", score: 80 },
    { name: "jacinto", score: 50 },
    { name: "jacinto", score: 40 },
    { name: "jacinto", score: 60 },
    { name: "jacinto", score: 70 },
];

const RankingPageContent: React.FC<{
    title: string;
    teacherName: string;
    topN: string;
}> = ({ title, teacherName, topN }) => {
    const [data, setData] = useState<Participant[]>([]);

    useEffect(() => {
        setData(mockData.slice(0, parseInt(topN, 10) || 0));
    }, [topN]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-500 to-cyan-500">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                {data.length > 0 ? (
                    <RankingChart
                        data={data}
                        title={title}
                        teacher={teacherName}
                        podiumLimit={Number(topN)}
                    />
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </main>
    );
};

export default function RankingPage() {
    const searchParams = useSearchParams();
    const title = searchParams.get("title") || "";
    const teacherName = searchParams.get("teacherName") || "";
    const topN = searchParams.get("topN") || "";

    return (
        <RankingPageContent
            title={title}
            teacherName={teacherName}
            topN={topN}
        />
    );
}
