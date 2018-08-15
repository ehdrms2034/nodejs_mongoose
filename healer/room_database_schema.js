require('mongoose');

let room_data_schema = new Schema({
    room_id : String,
    room_owner: String,
    room_subject :String,
    room_people : Int16Array,
    room_date : String

});

module.exports = room_data_schema;