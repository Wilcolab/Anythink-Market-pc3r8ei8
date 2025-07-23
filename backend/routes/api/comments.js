/**
 * @module routes/api/comments
 * @description Express router for handling comment-related API endpoints.
 */

 /**
    * GET /
    * @summary Get all comments with pagination.
    * @description Retrieves a paginated list of comments. Supports optional limit and offset query parameters.
    * @param {Request} req - Express request object, optionally containing `limit` and `offset` as query parameters.
    * @param {Response} res - Express response object.
    * @param {Function} next - Express next middleware function.
    * @returns {Object} JSON object containing an array of comments and the total count.
    */

 /**
    * DELETE /:id
    * @summary Delete a comment by ID.
    * @description Deletes a comment specified by its ID. Requires authentication.
    * @param {Request} req - Express request object, containing the comment ID as a route parameter.
    * @param {Response} res - Express response object.
    * @param {Function} next - Express next middleware function.
    * @returns {void} Responds with 204 No Content on success, 404 if comment not found.
    */
 const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");
const auth = require("../auth");

// Get all comments with pagination
router.get("/", auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
    .then(function(user) {
      return Promise.all([
        Comment.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: "desc" })
          .populate("seller")
          .exec(),
        Comment.count(query).exec()
      ]).then(function(results) {
        var comments = results[0];
        var commentsCount = results[1];

        return res.json({
          comments: comments.map(function(comment) {
            return comment.toJSONFor(user);
          }),
          commentsCount: commentsCount
        });
      });
    })
    .catch(next);
});

module.exports = router;
//add another endpoint for deleting a comment
router.delete("/:id", auth.required, async function(req, res, next) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.sendStatus(404);
        }
        // Optionally, check if the user is authorized to delete the comment
        await comment.remove();
        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});