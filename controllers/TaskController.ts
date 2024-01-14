import {Request, Response} from 'express';

import TaskModel from "../models/Task";

export const getAllByCurrentUser = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find({user: req.userId});

    console.log(tasks)
  } catch (err) {
    console.log(err);

    res.status(500).json({
      isSuccess: false,
      data: {},
      info: {
        message: 'Failed to get tasks by user ID',
        details: null
      }
    });
  }
}

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
          isSuccess: true,
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
        message: 'Failed to create task',
        details: null
      }
    });
  }
}

export default { create, getAllByCurrentUser }