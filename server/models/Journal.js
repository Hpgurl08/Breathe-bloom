const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  entry: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the current date when an entry is created
  },
  public: {
    type: String,
  },
  // Add a field for media, assuming it's a URL to the media
  media: {
    type: String,
  },
});

module.exports = mongoose.model("Journal", JournalSchema);
