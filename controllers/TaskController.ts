import {Request, Response} from 'express';

import TaskModel from "../models/Task";

// haven't tested yet, it may or may not work
export const create = async (req: Request, res: Response) => {
  try {
    const task = new TaskModel({
      labels: req.body.labels,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      user: req.userId
    });

    await task.save()
      .then((savedTask) => {
        res.json({
          isSuccess: false,
          data: {
            task: savedTask
          },
          info: {
            message: null,
            details: null
          }
        });
      })
  } catch (err) {
    console.log(err);

    res.status(500).json({
      isSuccess: false,
      data: {},
      info: {
        message: 'Failed to create user',
        details: null
      }
    });
  }
}