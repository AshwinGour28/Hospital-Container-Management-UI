import mongoose from "mongoose";

const containerSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    status: {type: String, default: "Created"},
    cpuUsage: {type: Number, default: 0},
    memoryUsage: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now}
});

const Container = mongoose.model("Container", containerSchema);
export default Container;