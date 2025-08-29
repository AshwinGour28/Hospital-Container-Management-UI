import express from "express";
import { createContainer, deleteContainer, getAllContainers, getContainerById, updateContainerStatus } from "../controllers/containerController.js";

const router = express.Router();

router.post('/', createContainer);
router.get('/', getAllContainers);
router.get('/:id', getContainerById);
router.put('/:id/status', updateContainerStatus);
router.delete('/:id', deleteContainer);

export default router;