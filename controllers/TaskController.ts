import {Request, Response} from 'express';

import TaskModel from "../models/Task";

export const getAllByCurrentUser = async (req: Request, res: Response) => {
  try {
    const tasks: any[] = await TaskModel.find({user: req.userId}).populate('user').exec();

    res.json({
      result: {
        tasks: tasks.map((task) => ({
          ...task._doc,
          user: {
            _id: task._doc.user.id,
            name: task._doc.user.name,
            username: task._doc.user.username,
          }
        }))
      },
      info: {
        message: null,
        details: null
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: {},
      info: {
        message: 'Failed to get tasks by user ID',
        details: null
      }
    });
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task: any = await TaskModel.findById(taskId).populate('user').exec();

    res.json({
            result: {
        task: {
          ...task._doc,
          user: {
            _id: task._doc.user.id,
            name: task._doc.user.name,
            username: task._doc.user.username,
          }
        }
      },
      info: {
        message: null,
        details: null
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: {},
      info: {
        message: 'Failed to get task',
        details: null
      }
    });
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    await TaskModel.findByIdAndDelete({
      _id: taskId
    });

    res.json({
      result: {},
      info: {
        message: null,
        details: null
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: {},
      info: {
        message: 'Failed to delete task',
        details: null
      }
    });
  }
}

export const updateOne = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const {labels, title, description, deadline, status} = req.body

    await TaskModel.updateOne({
      _id: taskId
    }, {
      ...(labels? { labels } : {}),
      ...(title? { title } : {}),
      ...(description? { description } : {}),
      ...(deadline? { deadline } : {}),
      ...(status ? {
        status: {
          id: status.id
        }
      } : {})
    });

    res.json({
      result: {},
      info: {
        message: null,
        details: null
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: {},
      info: {
        message: 'Failed to update task',
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
      deadline: req.body.deadline,
      status: {
        id: req.body.status.id
      },
      user: req.userId
    });

    await task.save()
      .then((savedTask) => {
        res.json({
          result: {
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
      result: {},
      info: {
        message: 'Failed to create task',
        details: null
      }
    });
  }
}

export default { create, getAllByCurrentUser, getOne, remove, updateOne }