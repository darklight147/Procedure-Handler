import mongoose, {Schema, Model, Document} from "mongoose"

const gameSchema: Schema = new mongoose.Schema({
    title: String,
    kebabTitle: String,
    magnetlink: String,
    size: Number,
    files: Number,
    review: Number,
    genre: String,
    thumbnail: String,
    old_thumbnail: String,
    backgroundimg: String,
    old_backgroundimg: String,
    money_link: String,
    money_linklol: String,
    trailerlink: String,
    count: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    updatesNdlcs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Updates",
      },
    ],
});

const Game: Model<Document, {}> = mongoose.model("Game", gameSchema);

export default Game