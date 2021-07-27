const model=require('./../models/models.js');
exports.homepage=async(req,res)=>{
try{
	const getdata=await model.find();
	res.status(200).render('content',{
		title:'Series Review',
		getdata
	});
}catch(err)
{
  res.status(200).json({
  	status:'failed bhai',
  	message:err
  })	
}
}
