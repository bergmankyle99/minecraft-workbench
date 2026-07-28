"use client";

import { useRef, useState } from "react";
import "../../globals.css";
import MinecraftButton from "@/app/components/MinecraftButton";

function BiomeFinderPage() {

    type Biome = {
        biome: string;
        x: number;
        z: number;
        samples: number;
    };

    const [loading, setLoading] = useState(false);
    const seedRef = useRef<HTMLInputElement>(null);
    const radiusRef = useRef<HTMLInputElement>(null);
    const xRef = useRef<HTMLInputElement>(null);
    const zRef = useRef<HTMLInputElement>(null);


    const [seedResult, setSeedResult] = useState<number | null>(null);
    const [result, setResult] = useState<Biome[]>([]);



    async function submit() {

        const seedValue = seedRef.current?.value;
        const radiusValue = radiusRef.current?.value;

        const seed = Number(seedValue);
        const radius = Number(radiusValue);


        if (!seedValue || Number.isNaN(seed)) {
            alert("Please enter a valid seed number");
            return;
        }


        if (!radiusValue || Number.isNaN(radius)) {
            alert("Please enter a valid radius");
            return;
        }


        setLoading(true);

        try {

            const res = await fetch(
                "/biome-finder1",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        seed: seed,

                        x: Number(
                            xRef.current?.value ?? 0
                        ),

                        z: Number(
                            zRef.current?.value ?? 0
                        ),

                        radius: radius,

                        version: 3100
                    })
                }
            );


            const data = await res.json();

            setSeedResult(data.seed);
            setResult(data.biomes);

        } catch (error) {

            console.error(error);
            alert("Failed to find biomes");

        } finally {

            setLoading(false);

        }
    }


    return (

        <div>

            <h2>Find Biomes</h2>



            <div className="find-structures-form">


                <div>
                    <label>Seed</label>
                    <br />

                    <input
                        type="number"
                        ref={seedRef}
                        placeholder="Seed"
                        defaultValue={12345}
                    />

                </div>



                <div>
                    <label>Center X</label>
                    <br />

                    <input
                        type="number"
                        ref={xRef}
                        defaultValue={0}
                    />

                </div>



                <div>
                    <label>Center Z</label>
                    <br />

                    <input
                        type="number"
                        ref={zRef}
                        defaultValue={0}
                    />

                </div>



                <div>
                    <label>Radius</label>
                    <br />

                    <input
                        type="number"
                        ref={radiusRef}
                        defaultValue={1000}
                        min={100}
                    />

                </div>

                <MinecraftButton
                    text={loading ? "Searching..." : "Find Biomes"}
                    onClick={submit}
                    disabled={loading}
                />

            </div>





            <div className="body-output">


                {seedResult !== null && (
                    <h2 className="historyTitle">
                        Seed: {seedResult}
                    </h2>
                )}



                <div className="history">


                    {result.map((biome, index) => (

                        <div
                            className="historyItem2"
                            key={index}
                        >


                            <p className="structureType2">
                                {biome.biome}
                            </p>



                            <p>
                                Approximate Location:
                            </p>


                            <p>
                                X: {biome.x},
                                {" "}
                                Z: {biome.z}
                            </p>



                            <p>
                                Samples Found:
                                {" "}
                                {biome.samples}
                            </p>


                        </div>

                    ))}


                </div>


            </div>


        </div>

    );
}


export default BiomeFinderPage;