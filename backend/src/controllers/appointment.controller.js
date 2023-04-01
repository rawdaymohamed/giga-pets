import Appointment from "../models/appointment.model";
import User from "../models/user.model";
import { extend } from "lodash";
export const create = async (req, res) => {
  const appointment = new Appointment(req.body);
  appointment.user = req.profile;
  try {
    await appointment.save();
    return res.status(200).json({
      message: "Appointment created successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};
export const appointmentByID = async (req, res, next, id) => {
  try {
    let appointment = await Appointment.findById(id).populate(
      "user",
      "_id name"
    );

    if (!appointment)
      return res.status("400").json({
        error: "Appointment not found",
      });
    req.appointment = appointment;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve appointment",
    });
  }
};
export const listByUser = async (req, res) => {
  try {
    let appointments = await Appointment.find({ user: req.profile._id })
      .sort("-created")
      .populate("user", "_id name")
      .exec();

    return res.json(appointments);
  } catch (err) {
    return res.status(400).json({
      error: "something went wrong",
    });
  }
};
