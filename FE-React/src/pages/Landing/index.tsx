import { useState, useEffect } from "react";

interface Data {
    message: string;
    data: number[];
}

const Landing = () => {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/data')
            .then((response) => response.json())
            .then((data: Data) => setData(data));
    }, []);

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1>React + Flask</h1>
            {data && (
                <>
                    <p>{data.message}</p>
                    <ul>
                        {data.data.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default Landing