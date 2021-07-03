import { PrismaClient } from '@prisma/client'
import { Response, Request, NextFunction } from 'express';
import * as express from 'express';
import Token from '../../classes/token';

import IControllerBase from '../../interfaces/IControllerBase.interface';
import { verificaTokenUsuario } from '../../middleware/autenticacion';


const prisma = new PrismaClient();

export default class TodoTask implements IControllerBase {
    public path = '/todo'
    public router = express.Router()

    constructor() {
        this.initRoutes();
        //this.router.toString;
        console.log('Clase Auth inicializada');
    }


    public initRoutes() {
        this.router.post(this.path + '', [verificaTokenUsuario], this.todoPost.bind(this));
        this.router.get(this.path + '', [verificaTokenUsuario], this.todoGet.bind(this));
        this.router.put(this.path + '/:id', [verificaTokenUsuario], this.todoPut.bind(this));
        /*this.router.get(this.path + '/:id', this.todoGet.bind(this));
        this.router.get(this.path + '/:id/:status', this.todoGet.bind(this)); */


        // this.router.get(this.path + '/:rpe', [verificaTokenUsuario, selfUsuario('SELF')], this.getUsuario.bind(this));
    }

    public async todoPost(req: any, res: Response) {
        const { title, task, email } = req.body;
        const user = req.usuario;
        if (!title || !task) {
            res.status(500)
                .json({
                    ok: false,
                    msg: 'Falta informacion al crear la tarea'
                });
            return;
        }
        try {
            const result = await prisma.todo.create({
                data: {
                    title,
                    task,
                    authorId: user.id
                    // author: { connect: { email: email } },
                },
            });
            res.json(result);
        } catch (error) {
            res.status(500)
                .json({
                    ok: false,
                    msg: `Error al crear la tarea ${error}`
                });
            return;
        }

    }

    public async todoGet(req: any, res: Response) {

        const usuario = req.usuario;
        try {
            const result = await prisma.todo.findMany({
                where: {
                    authorId: usuario.id,
                    status: { not: 'delete' }
                }
            });
            res.json(result);
        } catch (error) {
            res.status(500)
                .json({
                    ok: false,
                    msg: `Error al obtener las tareas`
                });
            return;
        }
    }

    public async todoPut(req: any, res: Response) {
        const { id } = req.params;
        const usuario = req.usuario;
        console.log(id);
        const { title, task, status } = req.body;
        if (!title || !task || !status) {
            res.status(500)
                .json({
                    ok: false,
                    msg: 'Falta informacion para la actualizacion de la tarea'
                });
            return;
        }
        if (('completed not-completed delete'.indexOf(status)) < 0) {
            res.status(500)
                .json({
                    ok: false,
                    msg: 'Falta status de la tarea erroneo'
                });
            return;
        }
        try {
            const todo = await prisma.todo.findFirst({
                where: {
                    title: title
                }
            });
            const result = await prisma.todo.update({
                where: {
                    id: todo.id
                },
                data: {
                    task: task,
                    title: title,
                    status: status
                }
            });
            res.json(result);
        } catch (error) {
            res.status(500)
                .json({
                    ok: false,
                    msg: `Error actualizar la tarea`
                });
            return;
        }
    }
}