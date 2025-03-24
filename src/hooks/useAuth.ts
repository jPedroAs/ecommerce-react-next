import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
            window.location.href = "/Login";
        } else {
            setAuthenticated(true);
        }
    }, []);

    return { authenticated };
}
