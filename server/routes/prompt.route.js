
import express from 'express'
import { handlePrompt } from '../controllers/promptControllers/handle.controller.js'

const router = express.Router()




router.post("/handle-prompt", handlePrompt)


export default router;