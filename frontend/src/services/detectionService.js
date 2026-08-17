import api from "./api";

export const processDetection = async (signalId, updateDb = true, image = null) => {
    const response = await api.post("/detection/process", {
        signal_id: signalId,
        update_db: updateDb,
        image
    });
    return response.data;
};

export const getDetectionStatus = async (signalId) => {
    const response = await api.get(`/detection/status/${signalId}`);
    return response.data;
};
