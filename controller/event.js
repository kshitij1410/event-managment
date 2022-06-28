const Event = require("../models/event");
const { verifyUser } = require("../middleware/verifyUser");
const User = require('../models/user');

//create event
exports.createEvent = async (req, res) => {
  let { eventName, time, description } = req.body;

  const { id } = req.decoded;
  try {
    const user = await User.findById(id);
    const event = await Event.create({
      eventName,
      time,
      description,
      createdBy: user.fullName,
    });

    if (user) {
      user.userEvents.push(event.id);
      await user.save();
    }
    return res.json({
      payload: event,
      message: "Event created successfully",
    });
  } catch (error) {
    return res.json({ message: "Something went wrong !" });
  }
};

//fetch all events

exports.getAllEvent = async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findById(id).populate("userEvents");
    if (user) {
      return res.json({
        payload: user.userEvents,
        message: "User Events",
      });
    }
    return res.json({ message: "User not found" });
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

//inviting users
exports.eventId = async (req, res) => {
  const { email } = req.body;

  try {
    const event = await Event.findById(req.params.eventId);
    const user = await User.findOne({ email });

    if (!event) {
      return res.json({ message: "Event not found" });
    }

    if (!user) {
      return res.json({
        message: "Please enter a valid email who is registered ",
      });
    }

    if (event.invitedUsers.includes(email)) {
      return res.json({ message: "You have already invited" });
    }
    user.invitedEvents.push({
      eventName: event.eventName,
      createdAt: event.createdAt,
      createdBy: event.createdBy,
    });
    await user.save();

    event.invitedUsers.push(email);
    await event.save();
    return res.json({
      payload: event.invitedUsers,
      message: "Invited Successfully",
    });
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

//see who is invited and show detail
exports.invitedEvent = async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findById(id);
    res.json(user.invitedEvents);
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
};

//get event detail
exports.getAllEventId = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.json({ message: "Event not found" });

    res.json({ message: "Event details", payload: event });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
};

// update event
exports.updateEvent = async (req, res) => {
  const { eventName, time, description } = req.body;

  try {
    const userId = req.decoded;
    const user = User.findById(userId.id);
    // Not update others event
    if (!user.userEvents.includes(req.params.eventId))
      return res.json({ message: "Not allowed to update event details" });

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.json({ message: "Event not found" });

    event.eventName = eventName;
    (event.time = time), (event.description = description);
    await event.save();
    res.json({ message: "Event details updated", payload: event });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
};

module.exports = exports;
