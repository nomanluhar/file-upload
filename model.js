import mongoose from "mongoose";

// export default 

const codeSchema = mongoose.Schema({
    userMedia : {
        type : String
    }
});

var Media = mongoose.model('media', codeSchema);
export default Media;

    