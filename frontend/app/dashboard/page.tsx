"use client";

import { useEffect, useRef, useState } from "react";

function DashboardPage() {
    const [structureJob, setStructureJob] = useState<string | null>(null);
    type Structure = {
        structureType: number;
        x: number;
        z: number;
    };
    // refs (NO STATE FOR INPUTS)
    const seedRef = useRef<HTMLInputElement>(null);
    // const versionRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const limit = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<Structure[]>([]);
    const submit = async () => {
        const res = await fetch("http://localhost:8000/structure-finder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                seed: Number(seedRef.current?.value ?? 12345),
                structure: typeRef.current?.value ?? "Village",
                limit: Number(limit.current?.value ?? 1000),
            }),
        });

        const data = await res.json();
        setResult(data.structures);
    };
    // useEffect(() => {
    //     if (!structureJob) return;

    //     const interval = setInterval(async () => {
    //         const res = await fetch(`http://localhost:8000/jobs/${structureJob}`);
    //         const data = await res.json();

    //         console.log("structure job:", data);

    //         if (data.state === "done") {
    //             clearInterval(interval);

    //             const parsed =
    //                 typeof data.result === "string"
    //                     ? JSON.parse(data.result)
    //                     : data.result;

    //             setResult(parsed.structures);

    //         }
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [structureJob]);

    return (
        <div>
            {/* STRUCTURE FINDER */}
            < h2 > Find Structures</h2 >

            <input ref={seedRef} placeholder="Seed" defaultValue={12345} />
            {/* <input ref={versionRef} placeholder="Version" defaultValue="22" /> */}
            {/* <input ref={typeRef} placeholder="Structure Type" defaultValue="Village" /> */}
            <select ref={typeRef} defaultValue="Village">
                <option value="Feature">Feature</option>
                <option value="Desert Pyramid">Desert Pyramid</option>
                <option value="Jungle Temple">Jungle Temple</option>
                <option value="Jungle Pyramid">Jungle Pyramid</option>
                <option value="Swamp Hut">Swamp Hut</option>
                <option value="Igloo">Igloo</option>
                <option value="Village">Village</option>
                <option value="Ocean Ruin">Ocean Ruin</option>
                <option value="Shipwreck">Shipwreck</option>
                <option value="Monument">Monument</option>
                <option value="Mansion">Mansion</option>
                <option value="Outpost">Outpost</option>
                <option value="Ruined Portal">Ruined Portal</option>
                <option value="Ruined Portal N">Ruined Portal N</option>
                <option value="Ancient City">Ancient City</option>
                <option value="Treasure">Treasure</option>
                <option value="Mineshaft">Mineshaft</option>
                <option value="Desert Well">Desert Well</option>
                <option value="Geode">Geode</option>
                <option value="Fortress">Fortress</option>
                <option value="Bastion">Bastion</option>
                <option value="End City">End City</option>
                <option value="End Gateway">End Gateway</option>
                <option value="End Island">End Island</option>
                <option value="Trail Ruin">Trail Ruin</option>
                <option value="Trial Chambers">Trial Chambers</option>
            </select>
            <input ref={limit} placeholder="Limit" defaultValue={1000} />

            <button onClick={submit}>Find</button>


            {/* {result && (
            <pre>{JSON.stringify(result, null, 2)}</pre>
        )} */}
            <div className="structures">
                {result.map((structure, index) => (
                    <div className="structure" key={index}>
                        <p>{structure.structureType}</p>
                        <p>X: {structure.x}</p>
                        <p>Z: {structure.z}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default DashboardPage