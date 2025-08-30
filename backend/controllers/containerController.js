import { model } from "mongoose";
import Container from "../models/Container.js"
import docker from "../docker/dockerClient.js";
import { getContainerStats } from "../utils/dockerStats.js";

export const createContainer = async (req, res) => {
    try{
        const {name, image} = req.body;

        if(!name || !image){
            return res.status(400).json({error: "Name and Image are required"});
        }

        await docker.pull(image);

        const container = await docker.createContainer({
            Image: image,
            name: name.toLowerCase(),
            Tty: true
        });

        await container.start();

        const newContainer = await Container.create({
            name, 
            image,
            status: "Running"
        });

        res.status(201).json({message: "Container created and started", container: newContainer});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}

export const getAllContainers = async(req, res) => {
    try{
        const containers = await Container.find();

        const containerWithStatus = await Promise.all(
            containers.map(async (container)=>{
                try{
                    const dockerContainer = docker.getContainer(container.name.toLowerCase());
                    const details = await dockerContainer.inspect();
                    const stats = await getContainerStats(dockerContainer);

                    return {
                        ...container.toObject(),
                        dockerStatus: details.State.Status,
                        cpuUsage: stats.cpuUsage,
                        memoryUsage: stats.memoryUsage
                    }
                }
                catch{
                    return {
                        ...container.toObject(),
                        dockerStatus: "not found",
                        cpuUsage: "N/A",
                        memoryUsage: "N/A"
                    }
                }
            })
        )

        res.status(200).json(containerWithStatus);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

export const getContainerById = async (req, res) => {
  try {
    const containerData = await Container.findById(req.params.id);
    if (!containerData) return res.status(404).json({ error: "Container not found" });

    let dockerStatus = "not found", stats = { memoryUsage: "N/A", cpuUsage: "N/A" };
    try {
      const dockerContainer = docker.getContainer(containerData.name.toLowerCase());
      const details = await dockerContainer.inspect();
      stats = await getContainerStats(dockerContainer);
      dockerStatus = details.State.Status;
    } catch {}

    res.status(200).json({ 
      ...containerData.toObject(),
      dockerStatus,
      ...stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const startContainer = async(req, res) => {
    try{
        const containerData = await Container.findById(req.params.id);

        if(!containerData) return res.status(404).json({error: "Container not found"});

        const container = docker.getContainer(containerData.name.toLowerCase());
        await container.start();

        containerData.status = "Running";
        await containerData.save();

        res.status(200).json({message: `Container started successfully`})
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

export const stopContainer = async (req, res) => {
    try{
        const containerData = await Container.findById(req.params.id);
        if(!containerData) res.status(404).json({error: "Container not found"});

        const container = docker.getContainer(containerData.name.toLowerCase());
        await container.stop();

        containerData.status = "Stopped";
        await containerData.save();

        res.status(200).json({message: "Container stopped successfully"});

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}


export const restartContainer = async (req, res) => {
    try{
        const containerData = await Container.findById(req.params.id);
        if(!containerData) res.status(404).json({error: "Container not found"});

        const container = docker.getContainer(containerData.name.toLowerCase());
        await container.restart();

        containerData.status = "Running";
        await containerData.save();

        res.status(200).json({message: "Container restarted successfully"});

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

export const deleteContainer = async (req, res) => {
    try {
        const containerData = await Container.findById(req.params.id);
        if(!containerData) res.status(404).json({error: "Container not found"});

        const container = docker.getContainer(containerData.name.toLowerCase());
        await container.stop().catch(()=>{});
        await container.remove();

        await Container.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Container deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}