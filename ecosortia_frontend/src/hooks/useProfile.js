import { useEffect, useState, useCallback, useRef } from "react";
import { getProfile } from "../services/profileService";

function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestIdRef = useRef(0);

    const fetchProfile = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        try {
            setLoading(true);
            setError(null);
            const data = await getProfile();
            if (requestId === requestIdRef.current) {
                setProfile(data);
            }
        } catch (err) {
            if (requestId === requestIdRef.current) {
                setError(err);
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        setProfile,
        loading,
        error,
        refetch: fetchProfile,
    };
}

export default useProfile;