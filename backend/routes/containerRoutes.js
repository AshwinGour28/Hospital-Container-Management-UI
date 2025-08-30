import express from "express";
import { createContainer, deleteContainer, getAllContainers, getContainerById, restartContainer, startContainer, stopContainer } from "../controllers/containerController.js";

const router = express.Router();

router.post('/', createContainer);
router.get('/', getAllContainers);
router.get('/:id', getContainerById);
router.put('/:id/start', startContainer);
router.put('/:id/stop', stopContainer);
router.put('/:id/restart', restartContainer);
router.delete('/:id', deleteContainer);

export default router;