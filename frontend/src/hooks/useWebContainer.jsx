import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

export default function useWebContainer() {
    // Initialize state with null
    const [webContainer, setWebContainer] = useState(null);

    useEffect(() => {
        async function startWebContainer() {
            try {
                // Boot the WebContainer instance
                const containerInstance = await WebContainer.boot();
                setWebContainer(containerInstance);
            } catch (error) {
                console.error("Failed to boot WebContainer:", error);
            }
        }

        // Call the async function to start the container
        startWebContainer();

        // The empty dependency array ensures this effect runs only once on mount.
    }, []);

    return webContainer;
}