"use client";

import { useEffect, useRef, useState } from "react";
import "../globals.css";
import MinecraftButton from "../components/MinecraftButton";
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
    const defaultHistory = [{


        id: 1,
        seed: 123456789,
        structureType: "Village",
        dimension: 0,
        structures: [
            {
                structureType: "Village",
                x: 250,
                z: 370
            },
        ]
    }];
    const [history, setHistory] = useState<any[]>(defaultHistory);
    async function loadHistory() {
        const token = localStorage.getItem("token");
        const res = await fetch("/search-history",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await res.json();
        setHistory(data);
    }
    useEffect(() => {
        loadHistory();
    }, []);
    // refs (NO STATE FOR INPUTS)
    const seedRef = useRef<HTMLInputElement>(null);
    // const versionRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const dimensionRef = useRef<HTMLSelectElement>(null);
    const limit = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<Structure[]>([]);
    const [historyResult, setHistoryResult] = useState<Structure[]>([]);
    const submit = async () => {
        const token = localStorage.getItem("token");
        const seedValue = seedRef.current?.value;
        const limitValue = limit.current?.value;

        const seed = Number(seedValue);
        const range = Number(limitValue);

        if (!seedValue || Number.isNaN(seed)) {
            alert("Please enter a valid seed number");
            return;
        }

        if (!limitValue || Number.isNaN(range)) {
            alert("Please enter a valid range number");
            return;
        }

        if (range <= 0) {
            alert("Range must be greater than 0");
            return;
        }
        const res = await fetch("/structure-finder", {
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
    const vals =
        [
            {
                "structureType": "Village",
                "x": 250,
                "z": 370
            }
        ]
    const fakeHistory = [
        {
            id: 1,
            seed: 123456789,
            structureType: "Village",
            dimension: 0,
            structures: [
                {
                    structureType: "Village",
                    x: 250,
                    z: 370
                },
            ]
        },
        {
            id: 2,
            seed: 987654321,
            structureType: "Ancient City",
            dimension: 0,
            structures: [
                {
                    structureType: "Ancient City",
                    x: -340,
                    z: 900
                },
            ]
        },
        {
            id: 3,
            seed: 55555555,
            structureType: "Fortress",
            dimension: -1,
            structures: [
                {
                    structureType: "Fortress",
                    x: 120,
                    z: -450
                }
            ]
        },
        {
            id: 4,
            seed: 55555555,
            structureType: "Fortress",
            dimension: -1,
            structures: [
                {
                    structureType: "Fortress",
                    x: 120,
                    z: -450
                }
            ]
        },
        {
            id: 5,
            seed: 55555555,
            structureType: "Fortress",
            dimension: -1,
            structures: [
                {
                    structureType: "Fortress",
                    x: 120,
                    z: -450
                }
            ]
        }
    ];
    function dimensionParse(dimension: Number) {
        switch (dimension) {
            case -1: return "Nether";
            case 0: return "Overworld";
            case 1: return "End";
            default: return "Overworld";
        }
    }
    return (
        <div>
            {/* STRUCTURE FINDER */}
            < h2 > Find Structures</h2 >
            <div className="find-structures-form">
                <div>
                    <label htmlFor="seed">Seed</label><br></br>
                    <input type="number" name="seed" ref={seedRef} placeholder="Seed" defaultValue={12345} />
                </div>

                {/* <input ref={versionRef} placeholder="Version" defaultValue="22" /> */}
                {/* <input ref={typeRef} placeholder="Structure Type" defaultValue="Village" /> */}
                <div>
                    <label htmlFor="dimension">Dimension</label><br></br>
                    <select name="dimension" ref={dimensionRef} value={dimension}
                        onChange={(e) => setDimension(Number(e.target.value))}>
                        <option value="-1">Nether</option>
                        <option value="0">Overworld</option>
                        <option value="1">End</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="structure">Structure Type</label><br></br>
                    <select name="structure" ref={typeRef} defaultValue="Village">
                        {getStructures().map((structure) => (
                            <option key={structure} value={structure}>
                                {structure}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="limit">Range</label><br></br>
                    <input min="1" max="100000" type="number" name="limit" ref={limit} placeholder="Limit" defaultValue={1000} />
                </div>

                <MinecraftButton
                    text={" Find Structures "}
                    onClick={submit}
                />

            </div>

            <div className="body-output">
                <br></br>
                <div className="structures">
                    {result.map((structures, index) => (
                        <div className="structure" key={index}>
                            <p className="structureType">{structures.structureType}</p>
                            <p>Seed: {seedRef.current?.value}</p>
                            <p>Dimension: {dimensionParse(dimension)}</p>
                            <p>X: {structures.x}, Z: {structures.z}</p>
                        </div>
                    ))}
                </div>
                <br></br>
                <br></br>
                <h3 className="historyTitle">History</h3>
                <div className="history">

                    {history.map((search) => (
                        <div className="historyItem" key={search.id}>
                            <h3>
                                {search.structureType}
                            </h3>
                            <p>
                                Seed: {search.seed}
                            </p>
                            <p>
                                Dimension: {dimensionParse(search.dimension)}
                            </p>
                            {search.structures.map((structure: any) => (
                                <div key={structure.x}>
                                    X: {structure.x},
                                    Z: {structure.z}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            </div>
        </div>

    );
}
export default DashboardPage
