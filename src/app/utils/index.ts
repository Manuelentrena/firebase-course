export function convertSnaps<T>(snaps) {
    return <T[]>snaps.docs.map((snap) => {
        return {
            id: snap.id,
            ...<any>snap.data(),
        };
    });
}