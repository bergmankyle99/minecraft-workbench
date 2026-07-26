"use client";

import { useEffect, useRef, useState } from "react";

function DashboardPage() {
    const [dimension, setDimension] = useState(0);
    const overworldStructures = [
        "Desert Pyramid",
        "Jungle Temple",
        "Jungle Pyramid",
        "Swamp Hut",
        "Igloo",
        "Village",
        "Ocean Ruin",
        "Shipwreck",
        "Monument",
        "Mansion",
        "Outpost",
        "Ruined Portal",
        "Ancient City",
        "Treasure",
        "Mineshaft",
        "Desert Well",
        "Geode",
        "Trail Ruin",
        "Trial Chambers"
    ];

    const netherStructures = [
        "Fortress",
        "Bastion",
        "Ruined Portal"
    ];

    const endStructures = [
        "End City",
        "End Gateway",
        "End Island"
    ];
    const getStructures = () => {
        switch (dimension) {
            case -1:
                return netherStructures;
            case 1:
                return endStructures;
            default:
                return overworldStructures;
        }
    };
    type Structure = {
        structureType: number;
        x: number;
        z: number;
    };
    const token = localStorage.getItem("token");
    const [history, setHistory] = useState<any[]>([]);
    async function loadHistory(){
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/search-history",
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await res.json();
        setHistory(data);
    }
    // refs (NO STATE FOR INPUTS)
    const seedRef = useRef<HTMLInputElement>(null);
    // const versionRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const dimensionRef = useRef<HTMLSelectElement>(null);
    const limit = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<Structure[]>([]);
    const [historyResult, setHistoryResult] = useState<Structure[]>([]);
    const submit = async () => {
        const res = await fetch("http://localhost:8000/structure-finder", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, },
            body: JSON.stringify({
                seed: Number(seedRef.current?.value ?? 12345),
                dimension: dimension,
                structure: typeRef.current?.value ?? "Village",
                limit: Number(limit.current?.value ?? 1000),
            }),
        });

        const data = await res.json();
        setResult(data.structures);
        loadHistory();
    };

    return (
        <div>
            {/* STRUCTURE FINDER */}
            < h2 > Find Structures</h2 >

            <input ref={seedRef} placeholder="Seed" defaultValue={12345} />
            {/* <input ref={versionRef} placeholder="Version" defaultValue="22" /> */}
            {/* <input ref={typeRef} placeholder="Structure Type" defaultValue="Village" /> */}
            <select ref={dimensionRef} value={dimension}
                onChange={(e) => setDimension(Number(e.target.value))}>
                <option value="-1">Nether</option>
                <option value="0">Overworld</option>
                <option value="1">End</option>
            </select>
            <select ref={typeRef} defaultValue="Village">
                {getStructures().map((structure) => (
                    <option key={structure} value={structure}>
                        {structure}
                    </option>
                ))}
            </select>
            <input ref={limit} placeholder="Limit" defaultValue={1000} />

            <button onClick={submit}>Find</button>

            <div className="structures">
                {result.map((structures, index) => (
                    <div className="structure" key={index}>
                        <p>{structures.structureType}</p>
                        <p>X: {structures.x}</p>
                        <p>Z: {structures.z}</p>
                    </div>
                ))}
            </div>
            {history.map((search)=>(
                <div key={search.id}>
                    <h3>
                        {search.structureType}
                    </h3>

                    <p>
                        Seed: {search.seed}
                    </p>

                    {search.structures.map((structure:any)=>(
                        <div key={structure.x}>
                            X: {structure.x}
                            Z: {structure.z}
                        </div>
                    ))}

                </div>
                ))}
            </div>
    );
}
export default DashboardPage