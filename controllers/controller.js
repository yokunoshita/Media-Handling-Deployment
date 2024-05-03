const  { PrismaClient } = require ("@prisma/client");
const prisma = new PrismaClient();
const path = require('path');
const imagekit = require('../libs/imagekit');

module.exports = {
    create: async (req, res, next) => {
        try {
            let { title, description } = req.body;
            let file = req.file.buffer.toString('base64');

            let uploaded_image = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: file
            });

            if (!title || !description || !file) {
                return res.status(400).json({
                    status: false,
                    message: 'Fill all requirments !',
                    data: null,
                });
            }

            let img = await prisma.images.create({
                data: {
                    title, 
                    description,
                    img_url: uploaded_image.url
                }
            });

            res.status(201).json({
                status: true,
                message: 'Uploaded',
                data: img
            });

        } catch (error) {
            next(error)
        }
    },

    index: async (req, res, next) => {
        try {
            let listImg = await prisma.images.findMany();

            res.status(200).json({
                status: true,
                message: 'Ok',
                data: listImg
            });

        } catch (error) {
            next(error)
        }
    },

    show: async (req, res, next) => {
        let imgId = Number(req.params.id);

        try {
            let exist = await prisma.images.findUnique({where: {id: imgId}});

            if (!exist) {
                return res.status(404).json({
                    status: false,
                    message: 'id invalid'
                });
            }

            let img = await prisma.images.findUnique({where: {id: imgId}});

            res.status(200).json({
                status: true,
                message: 'Ok',
                data: img
            });

        } catch (error) {
            next(error)
        }
    },

    update: async (req, res, next) => { //Only update title and description
        let imgId = Number(req.params.id);
       
        try {
            let { title, description } = req.body;
            let exist = await prisma.images.findUnique({where: {id: imgId}})

            if (!exist) {
                return res.status(400).json({
                    status: false,
                    message: 'id invalid'
                });
            }

            if (!title || !description) {
                return res.status(400).json({
                    status: false,
                    message: 'Fill all requirments !',
                    data: null,
                });
            }

            let img = await prisma.images.update({
                where: {
                    id: imgId
                },
                data: { 
                    title, 
                    description
                }
            });

            res.status(201).json({
                status: true,
                message: 'Updated',
                data: img
            });
        } catch (error) {
            next(error)
        }
    },

    delete: async (req, res, next) => {
        let imgId = Number(req.params.id);

        try {
            let exist = await prisma.images.findUnique({where: {id: imgId}});

            if(!exist){
                return res.status(404).json({
                    status: false,
                    message: 'Invalid id',
                    data: null
                })
            }

            let del = await prisma.images.delete({where: {id: imgId}});

            res.status(201).json({
                status: true,
                message: 'Deleted',
                data: null
            });

        } catch (error) {
            next(error)
        }
    }
};