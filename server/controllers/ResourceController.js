const Therapist = require("../models/Resource");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");

const token = localStorage.getItem("AUTH_TOKEN");

exports.getSearchPage = async (req, res) => {
  const info = {
    title: "Search Therapists",
    description: "Find a local therapist that suits your needs.",
    therapists: "",
    result: 0,
    token: token,
  };
  res.render("resources", info);
};

// Controller method to search for therapists
exports.searchTherapists = async (req, res) => {
  try {
    const { query, source } = req.query;

    if (source === "google") {
      // Redirect to Google search route with query
      return res.redirect(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`
      );
    }

    // Define search criteria for local search
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
      available: true,
    };

    // Search for therapists based on the criteria
    const therapists = await Therapist.find(searchCriteria);

    const info = {
      title: "Results Therapists",
      description: "Find a local therapist that suits your needs.",
      therapists: therapists,
      result: therapists.length > 0 ? 1 : 0,
      token: token,
    };

    res.render("resources", info);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ success: false, message: err.message }); // Send specific error message
  }
};
