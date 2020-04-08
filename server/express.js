const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


const multer = require("multer");
const fs = require('fs');
const path=require('path');




//允许express处理post请求提交过来的json数据  *******非常关键******
app.use(express.json());

//解析表单等数据
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//密钥
let secretOrPrivateKey="jwt";

let jsonParser = bodyParser.json();

//解决跨域问题，一个端口可以请求另一个端口的接口
app.use(require('cors')());
// app.use(express.static('public'));

const mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test',
  multipleStatements: true
});


//发布菜谱大全的菜谱
const uploadMenu = multer({
  dest: '../public/menuImg'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/upload', uploadMenu.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/menuImg/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  });

  const pic='menuImg/'+radname+suffix;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const type=0;
  const data={
    pic,
    userId,
    menuName,
    menuMaterial,
    menuContent,
    type
  };
  const sqlStr = 'insert into menu set ?';
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});

//获取菜谱大全的信息
app.get('/api/menuShow', (req, res) => {
  const sqlStr = 'select * from menu';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});

//删除菜谱大全的菜谱
app.post('/api/existUser', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);

  const sqlStr = 'select * from menu where menuId='+menuId+' '+'and userId='+userId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    if(results.length===0){
      res.json({isUser:false});
    }
    else res.json({code: 200, message: results,isUser:true, affectedRows: results.affectedRows});
  })
});


app.post('/api/deleteMenu', function (req, res) {
  const menuId=parseInt(req.body.menuId);
  const pic=req.body.pic;
  const filepath='../public/'+pic;
  const sql = 'delete menucollection,menu,menucomment from menu left join menucollection on menu.menuId=menucollection.collectId left join menucomment on menucollection.collectId=menucomment.menuId where menu.menuId='+menuId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    if(results.length!=0){
      fs.unlink(filepath, function(err){
        if(err){
          throw err;
        }
        console.log('文件删除成功！');
      })
    }
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});


//修改菜谱大全的菜谱
app.post('/api/getMenuPic', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select pic from menu where menuId='+menuId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


const modifyMenu = multer({
  dest: '../public/menuImg'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/modifyMenu', modifyMenu.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/menuImg/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('修改成功!');
  });

  //删除原图片
  const oldPic=req.body.oldPic;
  const filepath='../public/'+oldPic;
  fs.unlink(filepath, function(err){
    if(err){
      throw err;
    }
    console.log('原图片文件删除成功！');
  });


  const pic='menuImg/'+radname+suffix;
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const menuId=parseInt(req.body.menuId);
  const sqlStr = 'update menu set pic="'+pic+'",menuName="'+menuName+'",menuMaterial="'+menuMaterial+'",menuContent="'+menuContent+'" '+'where menuId='+menuId;
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});





//发布春季菜谱的菜谱
const uploadSpring = multer({
  dest: '../public/springimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/uploadSpring', uploadSpring.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/springimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  });


  const pic='/springimages/'+radname+suffix;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const type=1;
  const data={
    pic,
    userId,
    menuName,
    menuMaterial,
    menuContent,
    type
  };
  const sqlStr = 'insert into springmenu set ?';
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});




//获取春季菜谱
app.get('/api/springMenuShow', (req, res) => {
  const sqlStr = 'select * from springmenu';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除春季菜谱的菜谱
app.post('/api/existSpringUser', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);

  const sqlStr = 'select * from springmenu where menuId='+menuId+' '+'and userId='+userId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    if(results.length===0){
      res.json({isUser:false});
    }
    else res.json({code: 200, message: results,isUser:true, affectedRows: results.affectedRows});
  })
});


app.post('/api/deleteSpring', function (req, res) {
  const menuId=parseInt(req.body.menuId);
  const pic=req.body.pic;
  const filepath='../public'+pic;
  const sql = 'delete springcollection,springmenu,springcomment from springmenu left join springcollection on springmenu.menuId=springcollection.collectId left join springcomment on springcollection.collectId=springcomment.menuId where springmenu.menuId='+menuId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    if(results.length!=0){
      fs.unlink(filepath, function(err){
        if(err){
          throw err;
        }
        console.log('文件删除成功！');
      })
    }
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});



//修改春季菜谱的菜谱
app.post('/api/getSpringPic', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select pic from springmenu where menuId='+menuId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


const modifySpring = multer({
  dest: '../public/springimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/modifySpring', modifySpring.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/springimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('修改成功!');
  });

  //删除原图片
  const oldPic=req.body.oldPic;
  const filepath='../public'+oldPic;
  fs.unlink(filepath, function(err){
    if(err){
      throw err;
    }
    console.log('原图片文件删除成功！');
  });


  const pic='/springimages/'+radname+suffix;
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const menuId=parseInt(req.body.menuId);
  const sqlStr = 'update springmenu set pic="'+pic+'",menuName="'+menuName+'",menuMaterial="'+menuMaterial+'",menuContent="'+menuContent+'" '+'where menuId='+menuId;
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});




//发布夏季菜谱的菜谱
const uploadSummer = multer({
  dest: '../public/summerimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/uploadSummer', uploadSummer.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/summerimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  });


  const pic='/summerimages/'+radname+suffix;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const type=2;
  const data={
    pic,
    userId,
    menuName,
    menuMaterial,
    menuContent,
    type
  };
  const sqlStr = 'insert into summermenu set ?';
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});




//获取夏季菜谱
app.get('/api/summerMenuShow', (req, res) => {
  const sqlStr = 'select * from summermenu';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});



//删除夏季菜谱的菜谱
app.post('/api/existSummerUser', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);

  const sqlStr = 'select * from summermenu where menuId='+menuId+' '+'and userId='+userId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    if(results.length===0){
      res.json({isUser:false});
    }
    else res.json({code: 200, message: results,isUser:true, affectedRows: results.affectedRows});
  })
});


app.post('/api/deleteSummer', function (req, res) {
  const menuId=parseInt(req.body.menuId);
  const pic=req.body.pic;
  const filepath='../public'+pic;
  const sql = 'delete summercollection,summermenu,summercomment from summermenu left join summercollection on summermenu.menuId=summercollection.collectId left join summercomment on summercollection.collectId=summercomment.menuId where summermenu.menuId='+menuId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    if(results.length!=0){
      fs.unlink(filepath, function(err){
        if(err){
          throw err;
        }
        console.log('文件删除成功！');
      })
    }
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});


//修改夏季菜谱的菜谱
app.post('/api/getSummerPic', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select pic from summermenu where menuId='+menuId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


const modifySummer = multer({
  dest: '../public/summerimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/modifySummer', modifySummer.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/summerimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('修改成功!');
  });

  //删除原图片
  const oldPic=req.body.oldPic;
  const filepath='../public'+oldPic;
  fs.unlink(filepath, function(err){
    if(err){
      throw err;
    }
    console.log('原图片文件删除成功！');
  });


  const pic='/summerimages/'+radname+suffix;
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const menuId=parseInt(req.body.menuId);
  const sqlStr = 'update summermenu set pic="'+pic+'",menuName="'+menuName+'",menuMaterial="'+menuMaterial+'",menuContent="'+menuContent+'" '+'where menuId='+menuId;
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});




//发布秋季菜谱的菜谱
const uploadAutumn = multer({
  dest: '../public/autumnimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/uploadAutumn', uploadAutumn.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/autumnimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  });


  const pic='/autumnimages/'+radname+suffix;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const type=3;
  const data={
    pic,
    userId,
    menuName,
    menuMaterial,
    menuContent,
    type
  };
  const sqlStr = 'insert into autumnmenu set ?';
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});




//获取秋季菜谱
app.get('/api/autumnMenuShow', (req, res) => {
  const sqlStr = 'select * from autumnmenu';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});



//删除秋季菜谱的菜谱
app.post('/api/existAutumnUser', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);

  const sqlStr = 'select * from autumnmenu where menuId='+menuId+' '+'and userId='+userId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    if(results.length===0){
      res.json({isUser:false});
    }
    else res.json({code: 200, message: results,isUser:true, affectedRows: results.affectedRows});
  })
});


app.post('/api/deleteAutumn', function (req, res) {
  const menuId=parseInt(req.body.menuId);
  const pic=req.body.pic;
  const filepath='../public'+pic;
  const sql = 'delete autumncollection,autumnmenu,autumncomment from autumnmenu left join autumncollection on autumnmenu.menuId=autumncollection.collectId left join autumncomment on autumncollection.collectId=autumncomment.menuId where autumnmenu.menuId='+menuId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    if(results.length!=0){
      fs.unlink(filepath, function(err){
        if(err){
          throw err;
        }
        console.log('文件删除成功！');
      })
    }
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});


//修改秋季菜谱的菜谱
app.post('/api/getAutumnPic', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select pic from autumnmenu where menuId='+menuId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


const modifyAutumn = multer({
  dest: '../public/autumnimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/modifyAutumn', modifyAutumn.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/autumnimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('修改成功!');
  });

  //删除原图片
  const oldPic=req.body.oldPic;
  const filepath='../public'+oldPic;
  fs.unlink(filepath, function(err){
    if(err){
      throw err;
    }
    console.log('原图片文件删除成功！');
  });


  const pic='/autumnimages/'+radname+suffix;
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const menuId=parseInt(req.body.menuId);
  const sqlStr = 'update autumnmenu set pic="'+pic+'",menuName="'+menuName+'",menuMaterial="'+menuMaterial+'",menuContent="'+menuContent+'" '+'where menuId='+menuId;
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});




//发布冬季菜谱的菜谱
const uploadWinter = multer({
  dest: '../public/winterimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/uploadWinter', uploadWinter.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/winterimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  });


  const pic='/winterimages/'+radname+suffix;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const type=4;
  const data={
    pic,
    userId,
    menuName,
    menuMaterial,
    menuContent,
    type
  };
  const sqlStr = 'insert into wintermenu set ?';
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});



//获取冬季菜谱
app.get('/api/winterMenuShow', (req, res) => {
  const sqlStr = 'select * from wintermenu';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除冬季菜谱的菜谱
app.post('/api/existWinterUser', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);

  const sqlStr = 'select * from wintermenu where menuId='+menuId+' '+'and userId='+userId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    if(results.length===0){
      res.json({isUser:false});
    }
    else res.json({code: 200, message: results,isUser:true, affectedRows: results.affectedRows});
  })
});


app.post('/api/deleteWinter', function (req, res) {
  const menuId=parseInt(req.body.menuId);
  const pic=req.body.pic;
  const filepath='../public'+pic;
  const sql = 'delete wintercollection,wintermenu,wintercomment from wintermenu left join wintercollection on wintermenu.menuId=wintercollection.collectId left join wintercomment on wintercollection.collectId=wintercomment.menuId where wintermenu.menuId='+menuId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    if(results.length!=0){
      fs.unlink(filepath, function(err){
        if(err){
          throw err;
        }
        console.log('文件删除成功！');
      })
    }
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});



//修改冬季菜谱的菜谱
app.post('/api/getWinterPic', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select pic from wintermenu where menuId='+menuId;
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


const modifyWinter = multer({
  dest: '../public/winterimages'
});//定义图片上传的临时目录

// 单域单文件上传：input[file]的 multiple != "multiple"
app.post('/api/modifyWinter', modifyWinter.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // 赋给图片的名称用时间戳+随机数获取
  const radname = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*666);

  //获取文件后缀名 .png .jpg
  const suffix=req.file.originalname.substr(req.file.originalname.lastIndexOf('.'));

  fs.rename(req.file.path, "../public/winterimages/" +radname+suffix, function(err) {
    if (err) {
      throw err;
    }
    console.log('修改成功!');
  });

  //删除原图片
  const oldPic=req.body.oldPic;
  const filepath='../public'+oldPic;
  fs.unlink(filepath, function(err){
    if(err){
      throw err;
    }
    console.log('原图片文件删除成功！');
  });


  const pic='/winterimages/'+radname+suffix;
  const menuName=req.body.menuName;
  const menuMaterial=req.body.menuMaterial;
  const menuContent=req.body.menuContent;
  const menuId=parseInt(req.body.menuId);
  const sqlStr = 'update wintermenu set pic="'+pic+'",menuName="'+menuName+'",menuMaterial="'+menuMaterial+'",menuContent="'+menuContent+'" '+'where menuId='+menuId;
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0,  message: results});
  });
});

//根据菜谱名搜素菜谱
app.post('/api/searchMenu', (req, res) => {
  const menuName = req.body.menuName;
  const sqlStr = 'select menuId,type from menu where menuName="'+menuName+'" union select menuId,type from springmenu where menuName="'+menuName+'" union select menuId,type from summermenu where menuName="'+menuName+'" union select menuId,type from autumnmenu where menuName="'+menuName+'" union select menuId,type from wintermenu where menuName="'+menuName+'"';
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});





//获取单个菜谱信息
app.post('/api/contentShow', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select * from menu where menuId=?';
  conn.query(sqlStr,menuId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});

//获取春季菜谱单个菜谱信息
app.post('/api/springContentShow', (req, res) => {
  const munuId = parseInt(req.body.menuId);
  const sqlStr = 'select * from springmenu where menuId=?';
  conn.query(sqlStr,munuId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});

//获取夏季菜谱单个菜谱信息
app.post('/api/summerContentShow', (req, res) => {
  const munuId = parseInt(req.body.menuId);
  const sqlStr = 'select * from summermenu where menuId=?';
  conn.query(sqlStr,munuId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});

//获取秋季菜谱单个菜谱信息
app.post('/api/autumnContentShow', (req, res) => {
  const munuId = parseInt(req.body.menuId);
  const sqlStr = 'select * from autumnmenu where menuId=?';
  conn.query(sqlStr,munuId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});

//获取冬季菜谱单个菜谱信息
app.post('/api/winterContentShow', (req, res) => {
  const munuId = parseInt(req.body.menuId);
  const sqlStr = 'select * from wintermenu where menuId=?';
  conn.query(sqlStr,munuId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//收藏菜谱大全的菜谱
app.post('/api/menuCollect', (req, res) => {
  //获取菜谱大全的id
  const collectId=parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    collectId,
    userId
  };
  const sqlStr = 'insert into menucollection set ?';

  //验证该菜谱是不是已经收藏过了，不是的话再插入数据
  const sqlStr1 = "select * from menucollection where collectId=?";
  conn.query(sqlStr1,collectId,(err, results) => {
    if (err) throw err;
    if (results.length != 0) {
      return res.status(400).send({status: 400, mess: '菜谱已经收藏了'});
    }
    else {
      conn.query(sqlStr, data, (err, results) => {
        if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
        res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
      })
    }

  })

});


//取消菜谱大全收藏的菜谱
app.post('/api/cancelMenuCollect', function (req, res) {
  const collectId=parseInt(req.body.menuId);
  const sql = 'delete from menucollection where collectId=' + collectId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});

//获取已经收藏的菜谱
app.get('/api/menuCollected', (req, res) => {
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sqlStr = 'select * from menucollection where userId=?';
  conn.query(sqlStr, userId,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//收藏春季菜谱的菜谱
app.post('/api/springCollect', (req, res) => {
  //获取春季菜谱的id
  const collectId=parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    collectId,
    userId
  };
  const sqlStr = 'insert into springcollection set ?';

  //验证该菜谱是不是已经收藏过了，不是的话再插入数据
  const sqlStr1 = "select * from springcollection where collectId=?";
  conn.query(sqlStr1,collectId,(err, results) => {
    if (err) throw err;
    if (results.length != 0) {
      return res.status(400).send({status: 400, mess: '菜谱已经收藏了'});
    }
    else {
      conn.query(sqlStr, data, (err, results) => {
        if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
        res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
      })
    }

  })

});


//取消春季菜谱收藏的菜谱
app.post('/api/cancelSpringCollect', function (req, res) {
  const collectId=parseInt(req.body.menuId);
  const sql = 'delete from springcollection where collectId=' + collectId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});

//获取已经收藏的春季菜谱
app.get('/api/springCollected', (req, res) => {
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sqlStr = 'select * from springcollection where userId=?';
  conn.query(sqlStr, userId,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});



//收藏夏季菜谱的菜谱
app.post('/api/summerCollect', (req, res) => {
  //获取夏季菜谱的id
  const collectId=parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    collectId,
    userId
  };
  const sqlStr = 'insert into summercollection set ?';

  //验证该菜谱是不是已经收藏过了，不是的话再插入数据
  const sqlStr1 = "select * from summercollection where collectId=?";
  conn.query(sqlStr1,collectId,(err, results) => {
    if (err) throw err;
    if (results.length != 0) {
      return res.status(400).send({status: 400, mess: '菜谱已经收藏了'});
    }
    else {
      conn.query(sqlStr, data, (err, results) => {
        if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
        res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
      })
    }

  })

});


//取消夏季菜谱收藏的菜谱
app.post('/api/cancelSummerCollect', function (req, res) {
  const collectId=parseInt(req.body.menuId);
  const sql = 'delete from summercollection where collectId=' + collectId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});

//获取已经收藏的夏季菜谱
app.get('/api/summerCollected', (req, res) => {
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sqlStr = 'select * from summercollection where userId=?';
  conn.query(sqlStr, userId,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});



//收藏秋季菜谱的菜谱
app.post('/api/autumnCollect', (req, res) => {
  //获取秋季菜谱的id
  const collectId=parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    collectId,
    userId
  };
  const sqlStr = 'insert into autumncollection set ?';

  //验证该菜谱是不是已经收藏过了，不是的话再插入数据
  const sqlStr1 = "select * from autumncollection where collectId=?";
  conn.query(sqlStr1,collectId,(err, results) => {
    if (err) throw err;
    if (results.length != 0) {
      return res.status(400).send({status: 400, mess: '菜谱已经收藏了'});
    }
    else {
      conn.query(sqlStr, data, (err, results) => {
        if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
        res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
      })
    }

  })

});


//取消秋季菜谱收藏的菜谱
app.post('/api/cancelAutumnCollect', function (req, res) {
  const collectId=parseInt(req.body.menuId);
  const sql = 'delete from autumncollection where collectId=' + collectId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});

//获取已经收藏的秋季菜谱
app.get('/api/autumnCollected', (req, res) => {
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sqlStr = 'select * from autumncollection where userId=?';
  conn.query(sqlStr, userId,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});



//收藏冬季菜谱的菜谱
app.post('/api/winterCollect', (req, res) => {
  //获取冬季菜谱的id
  const collectId=parseInt(req.body.menuId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    collectId,
    userId
  };
  const sqlStr = 'insert into wintercollection set ?';

  //验证该菜谱是不是已经收藏过了，不是的话再插入数据
  const sqlStr1 = "select * from wintercollection where collectId=?";
  conn.query(sqlStr1,collectId,(err, results) => {
    if (err) throw err;
    if (results.length != 0) {
      return res.status(400).send({status: 400, mess: '菜谱已经收藏了'});
    }
    else {
      conn.query(sqlStr, data, (err, results) => {
        if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
        res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
      })
    }

  })

});


//取消冬季菜谱收藏的菜谱
app.post('/api/cancelWinterCollect', function (req, res) {
  const collectId=parseInt(req.body.menuId);
  const sql = 'delete from wintercollection where collectId=' + collectId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '取消菜谱成功', affectedRows: results.affectedRows})
  })
});

//获取已经收藏的冬季菜谱
app.get('/api/winterCollected', (req, res) => {
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sqlStr = 'select * from wintercollection where userId=?';
  conn.query(sqlStr, userId,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//添加菜谱大全的评论
app.post('/api/menuComment', (req, res) => {
  //获取菜谱的id
  const menuId=parseInt(req.body.menuId);
  const comment=req.body.comment;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    menuId,
    userId,
    comment
  };
  const sqlStr = 'insert into menucomment set ?';
     //插入菜谱大全的评论
      conn.query(sqlStr, data, (err, results) => {
        if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
        res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
      })


  });


//展示菜谱大全的评论
app.post('/api/commentShow', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select menucomment.comment,menucomment.commentId,user.name from menucomment inner join user on  menucomment.userId=user.id and menuId=?';
  conn.query(sqlStr,menuId, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除菜谱大全的评论
app.post('/api/deleteComment', function (req, res) {
  const commentId=parseInt(req.body.commentId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sql = 'delete from menucomment where commentId='+ commentId+' '+'and userId='+userId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '删除菜谱成功', affectedRows: results.affectedRows})
  })
});






//添加春季菜谱的评论
app.post('/api/springComment', (req, res) => {
  //获取菜谱的id
  const menuId=parseInt(req.body.menuId);
  const comment=req.body.comment;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    menuId,
    userId,
    comment
  };
  const sqlStr = 'insert into springcomment set ?';
  //插入春季菜谱的评论
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
  })


});


//展示春季菜谱的评论
app.post('/api/springCommentShow', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select springcomment.comment,springcomment.commentId,user.name from springcomment inner join user on  springcomment.userId=user.id and menuId=?';
  conn.query(sqlStr,menuId, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除春季菜谱的评论
app.post('/api/deleteSpringComment', function (req, res) {
  const commentId=parseInt(req.body.commentId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sql = 'delete from springcomment where commentId='+ commentId+' '+'and userId='+userId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '删除菜谱成功', affectedRows: results.affectedRows})
  })
});



//添加夏季菜谱的评论
app.post('/api/summerComment', (req, res) => {
  //获取菜谱的id
  const menuId=parseInt(req.body.menuId);
  const comment=req.body.comment;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    menuId,
    userId,
    comment
  };
  const sqlStr = 'insert into summercomment set ?';
  //插入夏季菜谱的评论
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
  })


});


//展示夏季菜谱的评论
app.post('/api/summerCommentShow', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select summercomment.comment,summercomment.commentId,user.name from summercomment inner join user on  summercomment.userId=user.id and menuId=?';
  conn.query(sqlStr,menuId, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除夏季菜谱的评论
app.post('/api/deleteSummerComment', function (req, res) {
  const commentId=parseInt(req.body.commentId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sql = 'delete from summercomment where commentId='+ commentId+' '+'and userId='+userId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '删除菜谱成功', affectedRows: results.affectedRows})
  })
});


//添加秋季菜谱的评论
app.post('/api/autumnComment', (req, res) => {
  //获取菜谱的id
  const menuId=parseInt(req.body.menuId);
  const comment=req.body.comment;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    menuId,
    userId,
    comment
  };
  const sqlStr = 'insert into autumncomment set ?';
  //插入秋季菜谱的评论
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
  })


});


//展示秋季菜谱的评论
app.post('/api/autumnCommentShow', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select autumncomment.comment,autumncomment.commentId,user.name from autumncomment inner join user on  autumncomment.userId=user.id and menuId=?';
  conn.query(sqlStr,menuId, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除秋季菜谱的评论
app.post('/api/deleteAutumnComment', function (req, res) {
  const commentId=parseInt(req.body.commentId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sql = 'delete from autumncomment where commentId='+ commentId+' '+'and userId='+userId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '删除菜谱成功', affectedRows: results.affectedRows})
  })
});


//添加冬季菜谱的评论
app.post('/api/winterComment', (req, res) => {
  //获取菜谱的id
  const menuId=parseInt(req.body.menuId);
  const comment=req.body.comment;
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const data={
    menuId,
    userId,
    comment
  };
  const sqlStr = 'insert into wintercomment set ?';
  //插入冬季菜谱的评论
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
  })


});


//展示冬季菜谱的评论
app.post('/api/winterCommentShow', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select wintercomment.comment,wintercomment.commentId,user.name from wintercomment inner join user on  wintercomment.userId=user.id and menuId=?';
  conn.query(sqlStr,menuId, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//删除冬季菜谱的评论
app.post('/api/deleteWinterComment', function (req, res) {
  const commentId=parseInt(req.body.commentId);
  //验证token
  const content=String(req.headers.authorization).split(' ').pop();
  const {id}=jwt.verify(content,secretOrPrivateKey);
  const userId=parseInt(id);
  const sql = 'delete from wintercomment where commentId='+ commentId+' '+'and userId='+userId;
  conn.query(sql,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '删除菜谱成功', affectedRows: results.affectedRows})
  })
});



//获取饮食健康的菜谱
app.get('/api/healthydiet', (req, res) => {
  const sqlStr = 'select menuId,menuName,pic from healthydiet';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//获取单个饮食健康的菜谱
app.post('/api/healthydietcontent', (req, res) => {
  const menuId = parseInt(req.body.menuId);
  const sqlStr = 'select * from healthydiet where menuId=?';
  conn.query(sqlStr,menuId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//获取饮食资讯
app.get('/api/healthynews', (req, res) => {
  const sqlStr = 'select newsId,newsName,pic from healthynews';
  conn.query(sqlStr, (err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//获取单个饮食资讯
app.post('/api/healthynewscontent', (req, res) => {
  const newsId = parseInt(req.body.newsId);
  const sqlStr = 'select * from healthynews where newsId=?';
  conn.query(sqlStr,newsId ,(err, results) => {
    if (err) return res.json({err_code: 1, message: '数据不存在', affectedRows: 0});
    res.json({code: 200, message: results, affectedRows: results.affectedRows});
  })
});


//用户登录
app.post('/api/login', (req, res) => {
  const name = req.body.name;
  const pwd = req.body.pwd;


  const sqlStr = "select * from user where name=?";
  conn.query(sqlStr,name,(err, results) => {
    if (err) throw err;
    if (results.length!=0){
      let content ={id:results[0].id}; // 要生成token的主题信息
       // 这是加密的key（密钥）
      let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60*60*1  // 1小时过期
      });
      if (pwd != results[0].pwd){
        return  res.status(400).send({status:400,error:true,mess:'密码错误'});
      }
      res.json({status:200,mess:'ok',token:token,name:req.body.name})
    } else {
      return res.status(404).send({
        message:'账户不存在！',
        error:false,
      });
    }
    // if (err) throw err;
    // if(results.length===0){
    //   return res.status(422).send({
    //     message:'密码无效'
    //   });
    // }
    // res.json({err_code: 0, data: results, message:"登陆成功"});
  });
});







//添加
app.post('/api/add', (req, res) => {
  const data=req.body;
  const sqlStr = 'insert into user set ?';
  conn.query(sqlStr, data, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '添加成功', affectedRows: results.affectedRows});
  })
});



//修改密码
app.post('/api/getUser', function (req, res) {
  const name = req.body.name;
  const pwd = req.body.oldPwd;
  const sqlStr = "select name from user where name='"+name+"' and "+"pwd='"+pwd+"'";
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    if(results.length==0){
      return  res.status(400).send({status:400,mess:'用户名和密码错误',isError:true});
    }
    else res.json({err_code: 0, message: results, affectedRows: results.affectedRows});
  })
});



app.post('/api/modifyPassword', function (req, res) {
  const name = req.body.name;
  const pwd = req.body.newPwd;
  const sqlStr = "update user set pwd='"+pwd+"' where name='"+name+"'";
  conn.query(sqlStr,(err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '修改成功', affectedRows: results.affectedRows});
  })
});


//删除
app.delete('/api/delete/:id', function (req, res) {
  const id = req.params.id;
  const sql = 'delete from user where id=' + id;
  conn.query(sql, id, (err, results) => {
    if (err) return res.json({err_code: 1, message: err, affectedRows: 0});
    res.json({err_code: 0, message: '删除成功', affectedRows: results.affectedRows})
  })
});






app.listen( 3000, () => console.log(`express start`));