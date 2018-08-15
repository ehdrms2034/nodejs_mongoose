var mongoose = require('mongoose');
var express = require('express');
var http = require('http');
var app = express();


app.set('port',3000);
var server = http.createServer(app).listen(app.get('port'),()=>{

    console.log('서버 세팅 성공');


});

server.on('connection',function(){
    console.log("connection 완료");
});

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/mongodb_test');
db.on('error',console.error);
db.once('open',()=>{

    console.log("연결 성공");

});

var Schema = mongoose.Schema;
var room_data_schema = new Schema({
    room_name : String,
    room_owner: String,
    room_subject :String,
    room_people : Number,
    room_date : String,
    room_people_list : [new mongoose.Schema({people_id : String})]
    
    });

var room_relation_schema = new Schema({
    room_name : String,
    user_id : String,
    date : String,
    parent_friend : String,
    children_friend : [new mongoose.Schema({friend_id : String})]
    
});


var room_database = mongoose.model('room_database',room_data_schema);
var room_relation = mongoose.model('room_relation',room_relation_schema);


////////////////////ROOM DATABASE/////////////////////
/////////////////방 생성/////////////////////////////
app.get('/room/make',function(req,res){

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end("room_name"+req.query.room_name+ "<br>room_onwer:"+req.query.room_owner+"<br>room_subject:"+
        req.query.room_subject+"<br>room_people"+req.query.room_people);
    
    let time = new Date();
    let times = time.toLocaleDateString()+" "+time.toLocaleTimeString();    
        

    let room = new room_database({
        room_name : req.query.room_name,
        room_owner : req.query.room_owner,
        room_subject : req.query.room_subject,
        room_people :1,
        room_date : times,
        room_people_list : [{people_id : req.query.room_owner}] 
    });

    let relation = new room_relation({
        room_name : req.query.room_name,
        user_id : req.query.room_owner,
        date : times,
        parent_friend : 'null',

    });
    room.save();
    relation.save();
    console.log("mongoose: Healer 방 개설 완료");
});


////////////////////방참가///////////////////
app.get('/room/join',function(req,res){
    // 여기는 room_name 과 user_id를 이용해서 추가 시켜서 방참가 시켜놓는거
    // friend_id는 추천인 이름
    res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
    room_database.update({room_name : req.query.room_name}, {$push : {room_people_list : [{people_id:req.query.user_id}] },$inc : {room_people : 1}},function(err,doc){  
        if(err)console.log("에러");
        else console.log(doc+"변경성공");
        
    });

    let time = new Date();
    let times = time.toLocaleDateString()+" "+time.toLocaleTimeString();    

    /* Relation 부분 추가 */
    //추천인이 있을경우
    if(req.query.friend_id!=null){
        console.log("추천인 있음");

        let relation = new room_relation({
            room_name : req.query.room_name,
            user_id : req.query.user_id,
            date : times,
            parent_friend : req.query.friend_id,
        });
        room_relation.update({room_name : req.query.room_name , user_id : req.query.friend_id}, {$push  : {children_friend : [{friend_id : req.query.user_id}]}},function(err,doc){
            if(err)console.log("relation error");
            else console.log(doc + "추천인 연결 성공");
        });
        relation.save();
        
        //부모데이터베이스와 자식 데이터 베이스 연결

    }else{ //없을경우
        console.log("추천인 없음");
        let relation = new room_relation({
            room_name : req.query.room_name,
            user_id : req.query.room_owner,
            date : times,
            parent_friend : 'null',
        });
        relation.save();
        console.log("user 한명이 방에 참가 하였음");
    }

    //방에대한 유저에대한 관계 데이터베이스 부분 추가
    //경우의 수가 세 개가 있겠네
    // 추천인이 있을 때, 추천인이 없을 때
    //추천인이 부모노드가 되고 다른 자식 노드를 품을 수 있는 것들
    //그리고 헌혈증 관리 데이터 부분과
    
    res.end(req.query.user_id); 

});




//findAll 모두 조회
app.get('/room/findAll',function(req,res){

    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    room_database.find(function(err,result){
        if(err) return res.status(500).send({error: 'database failure'});
            res.end(result.toString());
            console.log("mongoose : room Data_BASE 모두 조회");}
    );
    
    
});

//findOne 하나만 조회
app.get('/room/findOne',function(req,res){

    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    room_database.findOne({room_name : req.query.room_name},function(err,result){  //요부분은 이렇게 수정
        if(err) return res.status(500).send({error: 'database failure'});
        if(result==null) res.end('null');
        else res.end(result.toString());
        console.log("mongoose : 유저데이터 1개 출력성공");
    });
    
    
});


