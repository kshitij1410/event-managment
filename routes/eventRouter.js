const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { paginatedResult } = require("../middleware/pagination");
const {
  createEvent,
  getAllEvent,
  eventId,
  invitedEvent,
  getAllEventId,
  updateEvent,
} = require("../controller/event");

const {
  validateInviteInput,
  validateEventInput,
  isRequestValidated,
} = require("../validator/eventValidator");

const { verifyUser } = require("../middleware/verifyUser");

router.post(
  "/createEvent",
  verifyUser,
  validateEventInput,
  isRequestValidated,
  createEvent
);
router.get("/events", verifyUser, paginatedResult(Event), getAllEvent);
router.put(
  "/:eventId",
  verifyUser,
  validateInviteInput,
  isRequestValidated,
  eventId
);

router.get("/invitedEvents", verifyUser, invitedEvent);

router.get("/:eventId", verifyUser, getAllEventId);
router.put(
  "/:eventId/updateEvent",
  verifyUser,
  validateEventInput,
  isRequestValidated,
  updateEvent
);

module.exports = router;
