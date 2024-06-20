const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "a message must belong to a Conversation"]
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "a message must belong to a User"]
        },
        text: {
            type: String,
            required: [true, "a message must have a text"]
        }
    },
    {
        timestamps: true
    })
messageSchema.post("save", function () {
    this.populate({
        path: "sender",
        select: "name _id gender profilePicture username isAdmin"
    })
})

module.exports = mongoose.model("Message", messageSchema)