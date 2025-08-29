import { model } from "mongoose";
import Container from "../models/Container.js"

export const createContainer = async (req, res) => {
    try{
        const {name, image} = req.body;

        if(!name || !image){
            return res.status(400).json({error: "Name and Image are required"});
        }

        const newContainer = await Container.create({name, image});
        res.status(201).json(newContainer);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}

export const getAllContainers = async(req, res) => {
    try{
        const containers = await Container.find();
        res.status(200).json(containers);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

export const getContainerById = async(req, res) => {
    try{
        const container = await Container.findById(req.params.id);
        if(!container){
            res.status(400).json({error: "Container not found"})
        }
        res.status(200).json(container);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

export const updateContainerStatus = async(req, res) => {
    try{
        const {status} = req.body;
        const container = await Container.findById(req.params.id);

        if(!container) return res.status(404).json({error: "Container not found"});

        container.status = status;
        await container.save();

        res.status(200).json({message: `Container ${status} successfully`, container})
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

export const deleteContainer = async (req, res) => {
    try {
        const container = await Container.findByIdAndDelete(req.params.id);
        if(!container) res.status(404).json({error: "Container not found"});
        res.status(200).json({message: "Container deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}